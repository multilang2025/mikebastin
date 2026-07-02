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

	// The server runs one Claude call per request and returns `continue: true`
	// when the task has more steps. The browser drives the loop so each HTTP
	// request stays short (one model call) and never trips the host gateway
	// timeout. Cap the auto-continues so a tool loop can't spin forever.
	const MAX_STEPS = 16;
	let busyEl = null;

	function append( role, text ) {
		const el = document.createElement( 'div' );
		el.className = 'aisa-msg aisa-msg--' + role;
		el.textContent = text;
		log.appendChild( el );
		log.scrollTop = log.scrollHeight;
	}

	function clearAttachment() {
		pendingAttachment = null;
		fileInput.value = '';
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

	// Run one step, then keep stepping while the server asks to continue.
	// `allowWrites` only applies to the first call of a chain (an approved
	// write); subsequent steps re-gate any further write for its own approval.
	// `attachment` (a CSV/Excel file) is only ever sent on the first call --
	// the server folds its contents into that turn's message, so resending it
	// on every auto-continue step would be pointless.
	function runChain( allowWrites, steps, attachment ) {
		setBusy( true );
		return send( allowWrites, attachment )
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
} )();
