<?php
/**
 * Parses a user-uploaded CSV or Excel (.xlsx) file into a bounded, UTF-8-safe
 * text block the model can use as grounded SEO reference data (keyword
 * metrics, competitor exports, etc.). No Composer dependency: CSV uses core
 * PHP's fgetcsv(), and .xlsx (a zip of XML files) is read directly with the
 * bundled ZipArchive + DOMDocument extensions rather than pulling in
 * PhpSpreadsheet, keeping the plugin a self-contained zip like every other
 * client in this codebase.
 *
 * Legacy binary .xls (pre-2007) is a complex proprietary format with no
 * built-in PHP reader; rather than ship a fragile from-scratch binary parser,
 * unsupported .xls files get a clear error asking for .xlsx or .csv instead.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * CSV/XLSX ingestion for the chat's file-attachment feature.
 */
class AISA_File_Parser {

	/** Reject anything bigger than this once decoded. */
	const MAX_BYTES = 5242880; // 5 MB.

	/** Data rows included in the model's context; the rest are summarized as a count. */
	const MAX_ROWS = 200;

	/**
	 * Parse an uploaded file into a text block for the conversation.
	 *
	 * @param array $attachment { name: string, type?: string, data: string (base64 or data: URL) }.
	 * @return string|WP_Error Context text, or an error describing what's wrong with the file.
	 */
	public static function parse( array $attachment ) {
		$name = sanitize_file_name( (string) ( $attachment['name'] ?? '' ) );
		$raw  = (string) ( $attachment['data'] ?? '' );
		if ( '' === $name || '' === $raw ) {
			return new WP_Error( 'aisa_bad_attachment', __( 'Missing file name or data.', 'ai-site-assistant' ) );
		}

		// The browser sends a data: URL (e.g. "data:text/csv;base64,...."); a
		// plain base64 string is also accepted for other callers.
		$comma = strpos( $raw, ',' );
		if ( 0 === strpos( $raw, 'data:' ) && false !== $comma ) {
			$raw = substr( $raw, $comma + 1 );
		}

		$bytes = base64_decode( $raw, true ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- decoding an uploaded file's own contents, not obfuscated code.
		if ( false === $bytes ) {
			return new WP_Error( 'aisa_bad_attachment', __( 'Could not decode the uploaded file.', 'ai-site-assistant' ) );
		}
		if ( strlen( $bytes ) > self::MAX_BYTES ) {
			return new WP_Error( 'aisa_file_too_large', __( 'That file is too large (max 5 MB). Try a smaller export, or a CSV.', 'ai-site-assistant' ) );
		}
		if ( '' === trim( $bytes ) ) {
			return new WP_Error( 'aisa_file_empty', __( 'The uploaded file is empty.', 'ai-site-assistant' ) );
		}

		$ext = strtolower( pathinfo( $name, PATHINFO_EXTENSION ) );
		switch ( $ext ) {
			case 'csv':
				$rows = self::parse_csv_bytes( $bytes );
				break;
			case 'xlsx':
				$rows = self::parse_xlsx_bytes( $bytes );
				break;
			case 'xls':
				return new WP_Error(
					'aisa_xls_unsupported',
					__( 'Legacy .xls files are not supported. Please re-save/export the file as .xlsx or .csv and try again.', 'ai-site-assistant' )
				);
			default:
				/* translators: %s: file extension the user tried to upload. */
				return new WP_Error( 'aisa_unsupported_type', sprintf( __( 'Unsupported file type ".%s". Upload a .csv or .xlsx file.', 'ai-site-assistant' ), $ext ) );
		}

		if ( is_wp_error( $rows ) ) {
			return $rows;
		}
		return self::rows_to_context( $rows, $name );
	}

	/**
	 * Parse CSV bytes into rows of cell strings. Handles a UTF-8 BOM, quoted
	 * multi-line fields (via a real stream + fgetcsv rather than naive line
	 * splitting), and non-UTF-8 encodings common in Excel-exported CSVs.
	 *
	 * @param string $bytes Raw file contents.
	 * @return array[]|WP_Error Array of rows (each an array of cell strings), or an error.
	 */
	private static function parse_csv_bytes( $bytes ) {
		$bytes = preg_replace( '/^\xEF\xBB\xBF/', '', $bytes );
		// An in-memory pseudo-file (never touches disk), not real filesystem
		// I/O -- WP_Filesystem has no fgetcsv() equivalent for streaming
		// quoted-multi-line-safe CSV parsing, so core stream functions are
		// the only option here.
		$stream = fopen( 'php://temp', 'r+b' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fopen
		fwrite( $stream, $bytes ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fwrite
		rewind( $stream );

		$rows = array();
		while ( false !== ( $row = fgetcsv( $stream, 0, ',', '"', '\\' ) ) ) {
			if ( 1 === count( $row ) && null === $row[0] ) {
				continue; // A wholly blank line.
			}
			$rows[] = array_map( array( __CLASS__, 'to_utf8' ), $row );
		}
		fclose( $stream ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose

		if ( empty( $rows ) ) {
			return new WP_Error( 'aisa_file_empty', __( 'No rows could be parsed from the CSV.', 'ai-site-assistant' ) );
		}
		return $rows;
	}

	/**
	 * Parse an .xlsx file's first worksheet into rows of cell strings, using
	 * only PHP's bundled Zip/DOM extensions.
	 *
	 * @param string $bytes Raw .xlsx file contents.
	 * @return array[]|WP_Error Array of rows (each an array of cell strings), or an error.
	 */
	private static function parse_xlsx_bytes( $bytes ) {
		if ( ! class_exists( 'ZipArchive' ) ) {
			return new WP_Error( 'aisa_no_zip', __( "This server's PHP is missing the Zip extension needed to read .xlsx files. Try uploading a .csv instead.", 'ai-site-assistant' ) );
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		global $wp_filesystem;
		if ( ! $wp_filesystem && ! WP_Filesystem() ) {
			return new WP_Error( 'aisa_no_filesystem', __( 'Could not initialize the WordPress filesystem.', 'ai-site-assistant' ) );
		}
		$tmp = wp_tempnam( 'aisa-xlsx' );
		$wp_filesystem->put_contents( $tmp, $bytes );

		$zip = new ZipArchive();
		if ( true !== $zip->open( $tmp ) ) {
			wp_delete_file( $tmp );
			return new WP_Error( 'aisa_bad_xlsx', __( 'Could not open the .xlsx file -- it may be corrupted or not a real Excel file.', 'ai-site-assistant' ) );
		}

		$shared     = array();
		$shared_xml = $zip->getFromName( 'xl/sharedStrings.xml' );
		if ( false !== $shared_xml ) {
			$shared = self::parse_shared_strings( $shared_xml );
		}
		$sheet_xml = $zip->getFromName( 'xl/worksheets/sheet1.xml' );
		$zip->close();
		wp_delete_file( $tmp );

		if ( false === $sheet_xml ) {
			return new WP_Error( 'aisa_bad_xlsx', __( 'Could not find a worksheet inside the .xlsx file.', 'ai-site-assistant' ) );
		}
		return self::parse_sheet_xml( $sheet_xml, $shared );
	}

	/**
	 * Extract the shared-string table (xl/sharedStrings.xml) referenced by
	 * index from string-typed cells.
	 *
	 * @param string $xml Raw sharedStrings.xml contents.
	 * @return string[] Ordered list of shared strings.
	 */
	private static function parse_shared_strings( $xml ) {
		$doc = self::load_xml( $xml );
		if ( ! $doc ) {
			return array();
		}
		$strings = array();
		foreach ( $doc->getElementsByTagName( 'si' ) as $si ) {
			$text = '';
			foreach ( $si->getElementsByTagName( 't' ) as $t ) {
				$text .= $t->nodeValue; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- native DOMNode property, not ours to rename.
			}
			$strings[] = self::to_utf8( $text );
		}
		return $strings;
	}

	/**
	 * Parse one worksheet's XML into dense rows of cell strings.
	 *
	 * @param string $xml    Raw sheetN.xml contents.
	 * @param array  $shared Shared-string table from parse_shared_strings().
	 * @return array[]|WP_Error Array of rows, or an error.
	 */
	private static function parse_sheet_xml( $xml, array $shared ) {
		$doc = self::load_xml( $xml );
		if ( ! $doc ) {
			return new WP_Error( 'aisa_bad_xlsx', __( 'Could not parse the worksheet inside the .xlsx file.', 'ai-site-assistant' ) );
		}

		$rows = array();
		foreach ( $doc->getElementsByTagName( 'row' ) as $row_el ) {
			$cells = array();
			foreach ( $row_el->getElementsByTagName( 'c' ) as $c ) {
				$col_index = self::column_index_from_ref( (string) $c->getAttribute( 'r' ) );
				$type      = $c->getAttribute( 't' );

				if ( 'inlineStr' === $type ) {
					$is                  = $c->getElementsByTagName( 'is' )->item( 0 );
					$cells[ $col_index ] = $is ? self::to_utf8( $is->textContent ) : ''; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- native DOMNode property.
					continue;
				}

				$v   = $c->getElementsByTagName( 'v' )->item( 0 );
				$raw = $v ? $v->nodeValue : ''; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- native DOMNode property.
				if ( 's' === $type ) {
					$cells[ $col_index ] = $shared[ (int) $raw ] ?? '';
				} else {
					$cells[ $col_index ] = self::to_utf8( $raw );
				}
			}
			if ( empty( $cells ) ) {
				continue;
			}
			ksort( $cells );
			$max   = max( array_keys( $cells ) );
			$dense = array();
			for ( $i = 0; $i <= $max; $i++ ) {
				$dense[] = $cells[ $i ] ?? '';
			}
			$rows[] = $dense;
		}

		if ( empty( $rows ) ) {
			return new WP_Error( 'aisa_file_empty', __( 'The Excel file has no data on its first sheet.', 'ai-site-assistant' ) );
		}
		return $rows;
	}

	/**
	 * Convert a spreadsheet cell reference's column letters (e.g. "B4" -> "B")
	 * into a 0-based column index.
	 *
	 * @param string $ref Cell reference, e.g. "AA12".
	 * @return int 0-based column index.
	 */
	private static function column_index_from_ref( $ref ) {
		preg_match( '/^([A-Z]+)/', $ref, $m );
		$letters = $m[1] ?? 'A';
		$index   = 0;
		for ( $i = 0, $len = strlen( $letters ); $i < $len; $i++ ) {
			$index = $index * 26 + ( ord( $letters[ $i ] ) - 64 );
		}
		return $index - 1;
	}

	/**
	 * Parse XML with external entity/network loading disabled and warnings
	 * suppressed rather than fatal, since the input is a user-uploaded file.
	 *
	 * @param string $xml Raw XML.
	 * @return DOMDocument|null Parsed document, or null if it isn't valid XML.
	 */
	private static function load_xml( $xml ) {
		$previous = libxml_use_internal_errors( true );
		$doc      = new DOMDocument();
		$ok       = $doc->loadXML( $xml, LIBXML_NONET );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );
		return $ok ? $doc : null;
	}

	/**
	 * Best-effort convert a cell value to valid UTF-8. Excel-exported CSVs
	 * are very commonly Windows-1252/Latin-1, and wp_json_encode() silently
	 * fails on invalid UTF-8 byte sequences.
	 *
	 * @param mixed $value Raw cell value.
	 * @return mixed Converted value (non-strings are returned unchanged).
	 */
	private static function to_utf8( $value ) {
		if ( ! is_string( $value ) || '' === $value ) {
			return $value;
		}
		if ( mb_check_encoding( $value, 'UTF-8' ) ) {
			return $value;
		}
		$detected  = mb_detect_encoding( $value, array( 'Windows-1252', 'ISO-8859-1', 'UTF-8' ), true );
		$converted = @mb_convert_encoding( $value, 'UTF-8', $detected ? $detected : 'Windows-1252' ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- a failed conversion falls back to the original value below rather than surfacing a notice for a user-uploaded file's odd encoding.
		return false !== $converted ? $converted : $value;
	}

	/**
	 * Turn parsed rows (first row = header) into the bounded, framed context
	 * text handed to the model. Prioritizes the file's own data as the
	 * source of truth for any figures the model uses in its response.
	 *
	 * @param array[] $rows     Parsed rows, including the header row.
	 * @param string  $filename Original (sanitized) filename, for display.
	 * @return string|WP_Error Context text, or an error if there's no usable data.
	 */
	private static function rows_to_context( array $rows, $filename ) {
		$header = array_shift( $rows );
		if ( null === $header ) {
			return new WP_Error( 'aisa_file_empty', __( 'No rows found in the file.', 'ai-site-assistant' ) );
		}
		$header = array_values( $header );
		foreach ( $header as $i => $h ) {
			$h            = trim( (string) $h );
			$header[ $i ] = '' !== $h ? $h : ( 'Column ' . ( $i + 1 ) );
		}

		$rows = array_values(
			array_filter(
				$rows,
				static function ( $row ) {
					foreach ( $row as $cell ) {
						if ( '' !== trim( (string) $cell ) ) {
							return true;
						}
					}
					return false;
				}
			)
		);
		if ( empty( $rows ) ) {
			return new WP_Error( 'aisa_file_empty', __( 'The file has a header row but no data rows.', 'ai-site-assistant' ) );
		}

		$total     = count( $rows );
		$truncated = $total > self::MAX_ROWS;
		$rows      = array_slice( $rows, 0, self::MAX_ROWS );

		$records = array();
		foreach ( $rows as $row ) {
			$record = array();
			foreach ( $header as $i => $col_name ) {
				$record[ $col_name ] = $row[ $i ] ?? '';
			}
			$records[] = $record;
		}

		$note = $truncated
			/* translators: 1: rows included, 2: total rows in the file. */
			? sprintf( __( 'showing the first %1$d of %2$d data rows', 'ai-site-assistant' ), self::MAX_ROWS, $total )
			/* translators: %d: number of data rows. */
			: sprintf( __( '%d data rows', 'ai-site-assistant' ), $total );

		return "Attached file: \"{$filename}\" ({$note}), columns: " . implode( ', ', $header ) . ".\n"
			. "This data is the SOURCE OF TRUTH for any figures used in this task -- do not invent or guess numbers that aren't present here.\n"
			. 'Data as JSON: ' . wp_json_encode( $records );
	}
}
