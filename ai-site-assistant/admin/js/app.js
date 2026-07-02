/* global AISA, wp */
( function () {
	'use strict';

	const log = document.getElementById( 'aisa-log' );
	const form = document.getElementById( 'aisa-form' );
	const input = document.getElementById( 'aisa-input' );

	// Running conversation. The API is stateless, so we resend it every turn.
	let messages = [];

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
		// Keep the "Working…" indicator pinned to the bottom: when it is
		// showing, insert new messages above it rather than after it.
		if ( busyEl ) {
			log.insertBefore( el, busyEl );
		} else {
			log.appendChild( el );
		}
		log.scrollTop = log.scrollHeight;
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

	function send( allowWrites ) {
		return wp.apiFetch( {
			url: AISA.restUrl,
			method: 'POST',
			headers: { 'X-WP-Nonce': AISA.nonce },
			data: { messages: messages, allow_writes: !! allowWrites },
		} );
	}

	// Run one step, then keep stepping while the server asks to continue.
	// `allowWrites` only applies to the first call of a chain (an approved
	// write); subsequent steps re-gate any further write for its own approval.
	function runChain( allowWrites, steps ) {
		setBusy( true );
		return send( allowWrites )
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

	form.addEventListener( 'submit', function ( e ) {
		e.preventDefault();
		const text = input.value.trim();
		if ( ! text ) {
			return;
		}
		append( 'user', text );
		messages.push( { role: 'user', content: text } );
		input.value = '';
		runChain( false, 0 );
	} );
} )();
