<?php
/**
 * Theme file access, and a draft-first sandbox for theme edits.
 *
 * Reads/lists/searches can target any installed theme (useful for inspecting
 * the live theme before changing anything). Writes are only ever allowed
 * inside a *draft* theme -- a full copy of the active theme living in its own
 * "<slug>-aisa-draft" directory, which WordPress already lists as an
 * independent theme. The live/active theme's files are never touched by this
 * class; "publishing" a draft means switch_theme()-ing to the draft copy,
 * not copying files back over the original.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Scoped theme file tools plus the draft-theme sandbox workflow.
 */
class AISA_Theme_Files {

	/**
	 * File extensions the assistant may read, list, search, or write.
	 *
	 * @var string[]
	 */
	const ALLOWED_EXTENSIONS = array( 'php', 'css', 'js', 'json', 'html', 'txt' );

	/**
	 * Suffix marking a theme directory as an AISA-created draft. write_*
	 * only ever targets a stylesheet ending in this suffix.
	 *
	 * @var string
	 */
	const DRAFT_SUFFIX = '-aisa-draft';

	/**
	 * List files under a theme (optionally a subdirectory), filtered to
	 * ALLOWED_EXTENSIONS. Read-only.
	 *
	 * @param array $in Tool input: { stylesheet?: string, subdir?: string }.
	 * @return array Tool result.
	 */
	public static function list_files( array $in ) {
		if ( ! current_user_can( 'edit_themes' ) ) {
			return self::error( 'Permission denied.' );
		}
		$stylesheet = sanitize_key( (string) ( $in['stylesheet'] ?? get_stylesheet() ) );
		$base       = self::resolve_dir( $stylesheet, (string) ( $in['subdir'] ?? '' ) );
		if ( is_wp_error( $base ) ) {
			return self::error( $base->get_error_message() );
		}

		$rows = array();
		$dir  = new RecursiveDirectoryIterator( $base, FilesystemIterator::SKIP_DOTS );
		$iter = new RecursiveIteratorIterator( $dir );
		foreach ( $iter as $file ) {
			$ext = strtolower( $file->getExtension() );
			if ( ! in_array( $ext, self::ALLOWED_EXTENSIONS, true ) ) {
				continue;
			}
			$rows[] = str_replace( trailingslashit( self::theme_dir( $stylesheet ) ), '', $file->getPathname() );
		}
		return array( 'content' => wp_json_encode( $rows ) );
	}

	/**
	 * Read one file's contents. Read-only.
	 *
	 * @param array $in Tool input: { stylesheet: string, path: string }.
	 * @return array Tool result.
	 */
	public static function read_file( array $in ) {
		if ( ! current_user_can( 'edit_themes' ) ) {
			return self::error( 'Permission denied.' );
		}
		$stylesheet = sanitize_key( (string) ( $in['stylesheet'] ?? get_stylesheet() ) );
		$path       = self::resolve_file( $stylesheet, (string) ( $in['path'] ?? '' ) );
		if ( is_wp_error( $path ) ) {
			return self::error( $path->get_error_message() );
		}
		if ( ! file_exists( $path ) ) {
			return self::error( 'File not found.' );
		}
		return array(
			'content' => wp_json_encode(
				array(
					'path'    => $in['path'],
					'content' => (string) file_get_contents( $path ),
				)
			),
		);
	}

	/**
	 * Search file contents for an exact string across a theme. Read-only.
	 *
	 * @param array $in Tool input: { stylesheet?: string, query: string }.
	 * @return array Tool result.
	 */
	public static function search_files( array $in ) {
		if ( ! current_user_can( 'edit_themes' ) ) {
			return self::error( 'Permission denied.' );
		}
		$query = (string) ( $in['query'] ?? '' );
		if ( '' === trim( $query ) ) {
			return self::error( 'Provide a "query" string to search for.' );
		}
		$stylesheet = sanitize_key( (string) ( $in['stylesheet'] ?? get_stylesheet() ) );
		$base       = self::resolve_dir( $stylesheet, '' );
		if ( is_wp_error( $base ) ) {
			return self::error( $base->get_error_message() );
		}

		$matches = array();
		$dir     = new RecursiveDirectoryIterator( $base, FilesystemIterator::SKIP_DOTS );
		$iter    = new RecursiveIteratorIterator( $dir );
		foreach ( $iter as $file ) {
			if ( ! in_array( strtolower( $file->getExtension() ), self::ALLOWED_EXTENSIONS, true ) ) {
				continue;
			}
			$lines = file( $file->getPathname() );
			if ( ! is_array( $lines ) ) {
				continue;
			}
			foreach ( $lines as $number => $line ) {
				if ( false !== strpos( $line, $query ) ) {
					$matches[] = array(
						'path' => str_replace( trailingslashit( self::theme_dir( $stylesheet ) ), '', $file->getPathname() ),
						'line' => $number + 1,
						'text' => trim( $line ),
					);
					if ( count( $matches ) >= 100 ) {
						break 2; // Bound the response so a common term can't return the whole theme.
					}
				}
			}
		}
		return array( 'content' => wp_json_encode( $matches ) );
	}

	/**
	 * Write one file's contents -- draft themes ONLY. Gated (destructive_tools).
	 *
	 * @param array $in Tool input: { stylesheet: string, path: string, content: string }.
	 * @return array Tool result.
	 */
	public static function write_file( array $in ) {
		if ( ! current_user_can( 'edit_themes' ) ) {
			return self::error( 'Permission denied.' );
		}
		$stylesheet = sanitize_key( (string) ( $in['stylesheet'] ?? '' ) );
		if ( ! str_ends_with( $stylesheet, self::DRAFT_SUFFIX ) ) {
			return self::error( 'write_theme_file only writes into an AISA draft theme. Call create_draft_theme first, then pass its stylesheet here.' );
		}
		$path = self::resolve_file( $stylesheet, (string) ( $in['path'] ?? '' ) );
		if ( is_wp_error( $path ) ) {
			return self::error( $path->get_error_message() );
		}

		$content = (string) ( $in['content'] ?? '' );
		if ( 'php' === strtolower( pathinfo( $path, PATHINFO_EXTENSION ) ) ) {
			$syntax_error = self::php_syntax_error( $content );
			if ( null !== $syntax_error ) {
				return self::error( 'Refused to write: PHP syntax error -- ' . $syntax_error );
			}
		}

		$fs = self::filesystem();
		if ( is_wp_error( $fs ) ) {
			return self::error( $fs->get_error_message() );
		}
		if ( ! $fs->put_contents( $path, $content, FS_CHMOD_FILE ) ) {
			return self::error( 'Could not write the file.' );
		}

		AISA_Audit_Log::record( 'write_theme_file', null, array( 'stylesheet' => $stylesheet, 'path' => $in['path'] ?? '' ) );
		return array( 'content' => 'Wrote ' . $in['path'] . " in draft theme \"{$stylesheet}\"." );
	}

	/**
	 * Copy the active theme into a new "<slug>-aisa-draft" directory. Gated.
	 *
	 * @param array $in Unused tool input.
	 * @return array Tool result with the new draft's stylesheet slug.
	 */
	public static function create_draft( array $in ) {
		if ( ! current_user_can( 'edit_themes' ) || ! current_user_can( 'install_themes' ) ) {
			return self::error( 'Permission denied.' );
		}
		$source = get_stylesheet();
		$draft  = $source . self::DRAFT_SUFFIX;
		$from   = self::theme_dir( $source );
		$to     = trailingslashit( get_theme_root() ) . $draft;

		if ( file_exists( $to ) ) {
			return self::error( "Draft \"{$draft}\" already exists. Publish or delete it before making a new one." );
		}

		$fs = self::filesystem();
		if ( is_wp_error( $fs ) ) {
			return self::error( $fs->get_error_message() );
		}
		require_once ABSPATH . 'wp-admin/includes/file.php';
		$copied = copy_dir( $from, $to );
		if ( is_wp_error( $copied ) ) {
			return self::error( 'Could not copy the theme into a draft directory: ' . $copied->get_error_message() );
		}

		AISA_Audit_Log::record( 'create_draft_theme', null, array( 'draft' => $draft ) );
		return array( 'content' => "Created draft theme \"{$draft}\" from \"{$source}\". Edit it with read_theme_file/write_theme_file, preview with get_theme_preview_url, then publish_draft_theme when ready." );
	}

	/**
	 * Promote a draft theme to the live/active theme. Gated.
	 *
	 * @param array $in Tool input: { stylesheet: string }.
	 * @return array Tool result.
	 */
	public static function publish_draft( array $in ) {
		if ( ! current_user_can( 'switch_themes' ) ) {
			return self::error( 'Permission denied.' );
		}
		$stylesheet = sanitize_key( (string) ( $in['stylesheet'] ?? '' ) );
		if ( ! str_ends_with( $stylesheet, self::DRAFT_SUFFIX ) ) {
			return self::error( 'publish_draft_theme only accepts an AISA draft theme (its stylesheet must end in "' . self::DRAFT_SUFFIX . '").' );
		}
		$theme = wp_get_theme( $stylesheet );
		if ( ! $theme->exists() ) {
			return self::error( "Draft \"{$stylesheet}\" was not found." );
		}

		switch_theme( $stylesheet );
		AISA_Audit_Log::record( 'publish_draft_theme', null, array( 'stylesheet' => $stylesheet ) );
		return array( 'content' => "Published draft \"{$stylesheet}\" -- it is now the active theme." );
	}

	/**
	 * Delete a draft theme's directory. Gated. Refuses to delete a non-draft
	 * or the currently active theme.
	 *
	 * @param array $in Tool input: { stylesheet: string }.
	 * @return array Tool result.
	 */
	public static function delete_draft( array $in ) {
		if ( ! current_user_can( 'delete_themes' ) ) {
			return self::error( 'Permission denied.' );
		}
		$stylesheet = sanitize_key( (string) ( $in['stylesheet'] ?? '' ) );
		if ( ! str_ends_with( $stylesheet, self::DRAFT_SUFFIX ) ) {
			return self::error( 'delete_draft_theme only accepts an AISA draft theme (its stylesheet must end in "' . self::DRAFT_SUFFIX . '").' );
		}
		if ( get_stylesheet() === $stylesheet ) {
			return self::error( 'Cannot delete the currently active theme. Switch to another theme first.' );
		}

		require_once ABSPATH . 'wp-admin/includes/theme.php';
		$result = delete_theme( $stylesheet );
		if ( is_wp_error( $result ) ) {
			return self::error( $result->get_error_message() );
		}

		AISA_Audit_Log::record( 'delete_draft_theme', null, array( 'stylesheet' => $stylesheet ) );
		return array( 'content' => "Deleted draft \"{$stylesheet}\"." );
	}

	/**
	 * Build a Customizer deep link to preview any installed theme (draft or
	 * not) without activating it -- the same URL the "Live Preview" button on
	 * Appearance > Themes uses. Read-only.
	 *
	 * @param array $in Tool input: { stylesheet: string }.
	 * @return array Tool result.
	 */
	public static function preview_url( array $in ) {
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return self::error( 'Permission denied.' );
		}
		$stylesheet = sanitize_key( (string) ( $in['stylesheet'] ?? '' ) );
		$theme      = wp_get_theme( $stylesheet );
		if ( ! $theme->exists() ) {
			return self::error( "Theme \"{$stylesheet}\" was not found." );
		}
		return array( 'content' => admin_url( 'customize.php?theme=' . rawurlencode( $stylesheet ) ) );
	}

	/**
	 * Absolute path to a theme's root directory.
	 *
	 * @param string $stylesheet Theme slug.
	 * @return string
	 */
	private static function theme_dir( $stylesheet ) {
		return trailingslashit( get_theme_root() ) . $stylesheet;
	}

	/**
	 * Resolve a (sub)directory inside a theme, rejecting anything that
	 * escapes the theme root (path traversal, symlink tricks) or doesn't exist.
	 *
	 * @param string $stylesheet Theme slug.
	 * @param string $subdir     Relative subdirectory, or ''.
	 * @return string|WP_Error Absolute real path, or an error.
	 */
	private static function resolve_dir( $stylesheet, $subdir ) {
		$root = realpath( self::theme_dir( $stylesheet ) );
		if ( ! $root ) {
			return new WP_Error( 'aisa_no_theme', "Theme \"{$stylesheet}\" was not found." );
		}
		if ( '' === $subdir ) {
			return $root;
		}
		$target = realpath( trailingslashit( $root ) . $subdir );
		if ( ! $target || 0 !== strpos( $target, $root ) ) {
			return new WP_Error( 'aisa_bad_path', 'That subdirectory is outside the theme.' );
		}
		return $target;
	}

	/**
	 * Resolve a file path inside a theme, enforcing the extension allowlist
	 * and rejecting anything that escapes the theme root.
	 *
	 * @param string $stylesheet Theme slug.
	 * @param string $path       Relative file path.
	 * @return string|WP_Error Absolute path (may not exist yet, for writes), or an error.
	 */
	private static function resolve_file( $stylesheet, $path ) {
		$ext = strtolower( pathinfo( $path, PATHINFO_EXTENSION ) );
		if ( ! in_array( $ext, self::ALLOWED_EXTENSIONS, true ) ) {
			return new WP_Error( 'aisa_bad_ext', 'That file extension is not allowed. Allowed: ' . implode( ', ', self::ALLOWED_EXTENSIONS ) . '.' );
		}

		$root = realpath( self::theme_dir( $stylesheet ) );
		if ( ! $root ) {
			return new WP_Error( 'aisa_no_theme', "Theme \"{$stylesheet}\" was not found." );
		}

		$candidate = trailingslashit( $root ) . ltrim( $path, '/\\' );
		$dir       = realpath( dirname( $candidate ) );
		if ( ! $dir || 0 !== strpos( $dir, $root ) ) {
			return new WP_Error( 'aisa_bad_path', 'That path is outside the theme.' );
		}
		return trailingslashit( $dir ) . basename( $candidate );
	}

	/**
	 * A pure-PHP PHP-syntax check (no exec()/proc_open()), so this works on
	 * hosts that disable shelling out. token_get_all() with TOKEN_PARSE
	 * throws a ParseError on invalid syntax without executing the code.
	 *
	 * @param string $code PHP source to check.
	 * @return string|null Error message, or null if the syntax is valid.
	 */
	private static function php_syntax_error( $code ) {
		try {
			token_get_all( $code, TOKEN_PARSE );
			return null;
		} catch ( ParseError $e ) {
			return $e->getMessage();
		}
	}

	/**
	 * Initialize WP_Filesystem for direct-method use. Theme file writes need
	 * this rather than raw file_put_contents() so they work under whatever
	 * filesystem method the host requires.
	 *
	 * @return WP_Filesystem_Base|WP_Error
	 */
	private static function filesystem() {
		global $wp_filesystem;
		require_once ABSPATH . 'wp-admin/includes/file.php';
		if ( ! $wp_filesystem && ! WP_Filesystem() ) {
			return new WP_Error( 'aisa_no_filesystem', 'Could not initialize the WordPress filesystem.' );
		}
		return $wp_filesystem;
	}

	/**
	 * Build a standard error tool result.
	 *
	 * @param string $message Error message.
	 * @return array
	 */
	private static function error( $message ) {
		return array(
			'content'  => $message,
			'is_error' => true,
		);
	}
}
