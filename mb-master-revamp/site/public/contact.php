<?php
/**
 * Contact form endpoint.
 *
 * The site is a Next.js static export, so there is no server to run a
 * Server Action in. This ships as a flat file alongside the export and
 * is served by the host's PHP, which is the same arrangement
 * valenciamove.com already uses on the same hosting.
 *
 * No credentials live here. The destination is a public address and the
 * host relays through its own MTA, so there is nothing to keep in .env.
 *
 * Both outcomes redirect to a real static page rather than back with a
 * query string. A static export cannot read one on the server, so
 * ?sent=1 would need a client component to say "thank you", which is a
 * lot of JavaScript for a sentence.
 */

declare(strict_types=1);

const TO      = 'hello@mikebastin.com';
const SUBJECT = 'mikebastin.com enquiry';
const THANKS  = '/contact/thanks/';
const FAILED  = '/contact/problem/';

function back(string $where): never {
    header('Location: ' . $where, true, 303);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    back(FAILED);
}

// Anything in the honeypot means a bot filled every field it could see.
// Answer 303 to the thank-you page rather than an error: a bot that is
// told it failed retries, and one that is told it succeeded does not.
if (trim((string)($_POST['company_website'] ?? '')) !== '') {
    back(THANKS);
}

$name    = trim((string)($_POST['name'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    back(FAILED);
}

// Header injection: a newline in a value that reaches a mail header
// turns one message into several. The reply-to address is the only
// submitted value that goes into a header, and it has already passed
// FILTER_VALIDATE_EMAIL, but strip control characters anyway rather than
// relying on that one check holding.
$replyTo = preg_replace('/[\r\n]+/', '', $email);

$fields = [
    'Name'    => $name,
    'Email'   => $email,
    'Company' => trim((string)($_POST['company'] ?? '')),
    'Budget'  => trim((string)($_POST['budget'] ?? '')),
    'Service' => trim((string)($_POST['service'] ?? '')),
    'Consent' => ($_POST['consent'] ?? '') === 'yes' ? 'yes' : 'no',
];

$body = '';
foreach ($fields as $label => $value) {
    $body .= $label . ': ' . ($value === '' ? '(not given)' : $value) . "\n";
}
$body .= "\n" . $message . "\n";

$headers = [
    'From: mikebastin.com <no-reply@mikebastin.com>',
    'Reply-To: ' . $replyTo,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = @mail(TO, SUBJECT, $body, implode("\r\n", $headers));

back($sent ? THANKS : FAILED);
