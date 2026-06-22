/* global AISA, wp */
( function () {
	'use strict';

	const log = document.getElementById( 'aisa-log' );
	const form = document.getElementById( 'aisa-form' );
	const input = document.getElementById( 'aisa-input' );

	// Running conversation. The API is stateless, so we resend it every turn.
	let messages = [];

	function append( role, text ) {
		const el = document.createElement( 'div' );
		el.className = 'aisa-msg aisa-msg--' + role;
		el.textContent = text;
		log.appendChild( el );
		log.scrollTop = log.scrollHeight;
	}

	function send( allowWrites ) {
		return wp.apiFetch( {
			url: AISA.restUrl,
			method: 'POST',
			headers: { 'X-WP-Nonce': AISA.nonce },
			data: { messages: messages, allow_writes: !! allowWrites },
		} );
	}

	function handleResponse( res ) {
		messages = res.messages;
		if ( res.reply ) {
			append( 'assistant', res.reply );
		}

		// The agent paused on a write it needs the user to approve.
		if ( res.pending ) {
			renderConfirm( res.pending );
		}
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
			// Re-run with writes allowed; the agent picks up the pending action.
			send( true ).then( handleResponse ).catch( showError );
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
		send( false ).then( handleResponse ).catch( showError );
	} );
} )();
