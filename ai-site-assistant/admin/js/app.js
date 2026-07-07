/* global AISA, wp */
( function () {
	'use strict';

	const log = document.getElementById( 'aisa-log' );
	const form = document.getElementById( 'aisa-form' );
	const input = document.getElementById( 'aisa-input' );
	const sendBtn = document.getElementById( 'aisa-send-btn' );
	const generateBtn = document.getElementById( 'aisa-generate-btn' );
	const attachBtn = document.getElementById( 'aisa-attach-btn' );
	const fileInput = document.getElementById( 'aisa-file-input' );
	const attachmentBadge = document.getElementById( 'aisa-attachment-badge' );

	// Running conversation. The API is stateless, so we resend it every turn.
	let messages = [];

	// A CSV/Excel file the user attached, waiting to go out with the next
	// message: { name, type, data } (data is a base64 data: URL).
	let pendingAttachment = null;

	// The server does at most one network-bound operation per request --
	// either a Claude call, or a single tool dispatch -- and returns
	// `continue: true` when there's more to do. The browser drives the loop
	// so each HTTP request stays short and never trips the host gateway
	// timeout. Since a "Claude decides, then a tool runs" step is now two
	// requests instead of one, this is doubled from its original 16 to keep
	// the same effective task-complexity ceiling. Cap the auto-continues so
	// a tool loop can't spin forever.
	const MAX_STEPS = 32;
	let busyEl = null;

	function append( role, text ) {
		const el = document.createElement( 'div' );
		el.className = 'aisa-msg aisa-msg--' + role;
		el.textContent = text;
		// Keep the "Working…" indicator pinned to the bottom: when it is
		// showing, insert new messages above it rather than after it.
		if ( busyEl ) {
			log.insertBefore( el, busyEl );
		} else {
			log.appendChild( el );
		}
		log.scrollTop = log.scrollHeight;
	}

	function clearAttachment() {
		pendingAttachment = null;
		if ( fileInput ) {
			fileInput.value = '';
		}
		if ( attachmentBadge ) {
			attachmentBadge.hidden = true;
			attachmentBadge.textContent = '';
		}
	}

	if ( attachBtn && fileInput ) {
		attachBtn.addEventListener( 'click', function () {
			fileInput.click();
		} );
		fileInput.addEventListener( 'change', function () {
			const file = fileInput.files && fileInput.files[ 0 ];
			if ( ! file ) {
				return;
			}
			const reader = new FileReader();
			reader.onload = function () {
				pendingAttachment = {
					name: file.name,
					type: file.type,
					data: reader.result, // data: URL; the server strips the prefix.
				};
				if ( attachmentBadge ) {
					attachmentBadge.hidden = false;
					attachmentBadge.textContent = '📎 ' + file.name;
				}
			};
			reader.onerror = function () {
				clearAttachment();
				showError( { message: 'Could not read that file.' } );
			};
			reader.readAsDataURL( file );
		} );
	}

	function setBusy( on ) {
		if ( on && ! busyEl ) {
			busyEl = document.createElement( 'div' );
			busyEl.className = 'aisa-msg aisa-msg--status';
			busyEl.textContent = 'Working…';
			log.appendChild( busyEl );
			log.scrollTop = log.scrollHeight;
		} else if ( ! on && busyEl ) {
			busyEl.remove();
			busyEl = null;
		}
		input.disabled = on;
	}

	function send( allowWrites, attachment ) {
		const data = { messages: messages, allow_writes: !! allowWrites };
		if ( attachment ) {
			data.attachment = attachment;
		}
		return wp.apiFetch( {
			url: AISA.restUrl,
			method: 'POST',
			headers: { 'X-WP-Nonce': AISA.nonce },
			data: data,
		} );
	}

	// A step's own request can still get killed by the site's front-end
	// gateway/CDN on a long chat: each step is a single isolated network op
	// (see AISA_Agent::run), but the plugin's own timeouts (120s to Claude,
	// 300s PHP execution) only bound WordPress's patience, not the inbound
	// browser-to-WordPress connection's. As a conversation grows (the full
	// history is resent every turn) a single Claude call can outlast that
	// limit with zero tool-call latency involved. apiFetch surfaces the
	// killed connection as `invalid_json` (a non-JSON body, e.g. a gateway's
	// HTML error page) rather than a structured API error. A failed attempt
	// never mutated `messages` -- the step that failed never got far enough
	// to return one -- so resending it is safe.
	const RETRYABLE_CODES = [ 'invalid_json', 'fetch_error' ];
	const RETRY_DELAY_MS = 1500;

	function wait( ms ) {
		return new Promise( function ( resolve ) {
			setTimeout( resolve, ms );
		} );
	}

	function sendWithRetry( allowWrites, attachment, attempt ) {
		attempt = attempt || 0;
		return send( allowWrites, attachment ).catch( function ( err ) {
			if ( attempt >= 2 || RETRYABLE_CODES.indexOf( err.code ) === -1 ) {
				throw err;
			}
			return wait( RETRY_DELAY_MS ).then( function () {
				return sendWithRetry( allowWrites, attachment, attempt + 1 );
			} );
		} );
	}

	// Run one step, then keep stepping while the server asks to continue.
	// `allowWrites` only applies to the first call of a chain (an approved
	// write); subsequent steps re-gate any further write for its own approval.
	// `attachment` (a CSV/Excel file) is only ever sent on the first call --
	// the server folds its contents into that turn's message, so resending it
	// on every auto-continue step would be pointless.
	function runChain( allowWrites, steps, attachment ) {
		setBusy( true );
		return sendWithRetry( allowWrites, attachment )
			.then( function ( res ) {
				messages = res.messages;
				if ( res.reply ) {
					append( 'assistant', res.reply );
				}

				// The agent paused on a write it needs the user to approve.
				if ( res.pending ) {
					setBusy( false );
					renderConfirm( res.pending );
					return;
				}

				if ( res.continue && steps < MAX_STEPS ) {
					return runChain( false, steps + 1 );
				}

				setBusy( false );
				if ( res.continue ) {
					append(
						'assistant',
						'⚠️ Stopped after several steps. Type "continue" to keep going.'
					);
				}
			} )
			.catch( function ( err ) {
				setBusy( false );
				showError( err );
			} );
	}

	function renderConfirm( pending ) {
		const box = document.createElement( 'div' );
		box.className = 'aisa-confirm';

		// Only ever a data: URI generated server-side (see
		// AISA_Agent::preview_for_pending) -- assigning it to an <img> src is
		// safe: a data: URI on an <img> renders as an image resource, it is
		// never interpreted as HTML/script the way innerHTML would be.
		if ( pending.preview ) {
			const img = document.createElement( 'img' );
			img.className = 'aisa-confirm-preview';
			img.src = pending.preview;
			img.alt = 'Preview of the generated image';
			box.appendChild( img );
		}

		const desc = document.createElement( 'p' );
		desc.textContent =
			'The assistant wants to run "' + pending.tool + '". Approve?';
		box.appendChild( desc );

		const yes = document.createElement( 'button' );
		yes.className = 'button button-primary';
		yes.textContent = 'Approve';
		yes.onclick = function () {
			box.remove();
			// Re-run with writes allowed; the agent executes the pending action
			// and the chain continues from there.
			runChain( true, 0 );
		};

		const no = document.createElement( 'button' );
		no.className = 'button';
		no.textContent = 'Cancel';
		no.onclick = function () {
			box.remove();
			append( 'assistant', 'Cancelled.' );
		};

		box.appendChild( yes );
		box.appendChild( no );
		log.appendChild( box );
		log.scrollTop = log.scrollHeight;
	}

	function showError( err ) {
		append( 'assistant', '⚠️ ' + ( err.message || 'Request failed.' ) );
	}

	// Both buttons share the same send path; "Generate Images" just biases
	// the message toward the image_generation skill server-side has no idea
	// which button was clicked, it only ever sees the resulting text.
	function submitMessage( text ) {
		if ( ! text ) {
			return;
		}
		append( 'user', text );
		messages.push( { role: 'user', content: text } );
		input.value = '';
		const attachment = pendingAttachment;
		clearAttachment();
		runChain( false, 0, attachment );
	}

	form.addEventListener( 'submit', function ( e ) {
		e.preventDefault();
		submitMessage( input.value.trim() );
	} );

	if ( generateBtn ) {
		// Hidden entirely when no Gemini key is configured (see class-aisa-settings.php).
		generateBtn.hidden = ! AISA.hasGeminiKey;
		generateBtn.addEventListener( 'click', function () {
			const text = input.value.trim();
			if ( ! text ) {
				return;
			}
			submitMessage(
				'Using the image_generation skill and the generate_image tool, ' + text
			);
		} );
	}

	// One-click "Copy" for the MCP onboarding wizard's command/config
	// snippets (see class-aisa-settings.php render_mcp_connector). Only
	// present on that page; harmless no-op everywhere else.
	function flashCopyBtn( btn, label ) {
		const original = btn.textContent;
		btn.textContent = label;
		setTimeout( function () {
			btn.textContent = original;
		}, 1500 );
	}

	document.querySelectorAll( '.aisa-copy-btn' ).forEach( function ( btn ) {
		btn.addEventListener( 'click', function () {
			const target = document.getElementById( btn.dataset.copyTarget );
			if ( ! target ) {
				return;
			}
			const text = target.textContent;

			// navigator.clipboard needs a secure context and can still reject
			// (permissions, non-HTTPS admin, older browsers) -- always fall
			// back to a manual-select so the button never fails silently for
			// a non-technical user who won't know to check devtools.
			const fallbackSelect = function () {
				const range = document.createRange();
				range.selectNodeContents( target );
				const selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange( range );
				flashCopyBtn( btn, 'Selected — press Ctrl+C' );
			};

			if ( navigator.clipboard ) {
				navigator.clipboard.writeText( text )
					.then( function () {
						flashCopyBtn( btn, 'Copied!' );
					} )
					.catch( fallbackSelect );
			} else {
				fallbackSelect();
			}
		} );
	} );
} )();
