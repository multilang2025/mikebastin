<?php
/**
 * Thin client for Google's PageSpeed Insights API (Lighthouse: performance,
 * accessibility, best practices, SEO). Unlike GSC/GA4, this needs no OAuth --
 * a plain API key (optional; Google allows unauthenticated calls at a lower
 * quota) is enough, so it follows the same simple static-key pattern as
 * AISA_Ahrefs_Client/AISA_Unsplash_Client rather than the OAuth clients.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Client for Google PageSpeed Insights (Lighthouse) audits.
 */
class AISA_Pagespeed_Client {

	const API_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

	/**
	 * All four Lighthouse categories PageSpeed Insights can score.
	 *
	 * @var string[]
	 */
	const CATEGORIES = array( 'performance', 'accessibility', 'best-practices', 'seo' );

	/**
	 * Resolve the configured API key. Optional -- PageSpeed Insights works
	 * keyless at a lower rate limit, so this is never a hard requirement.
	 *
	 * @return string
	 */
	public static function get_api_key() {
		if ( defined( 'AISA_PAGESPEED_API_KEY' ) && AISA_PAGESPEED_API_KEY ) {
			return AISA_PAGESPEED_API_KEY;
		}
		$opts = get_option( AISA_Settings::OPTION_KEY, array() );
		return $opts['pagespeed_api_key'] ?? '';
	}

	/**
	 * Run a Lighthouse audit against a live URL.
	 *
	 * @param string $url        Full URL to audit (must be publicly reachable -- Google's
	 *                           servers fetch it, not this site).
	 * @param string $strategy   "mobile" (default) or "desktop".
	 * @param array  $categories Subset of self::CATEGORIES to run (default: all four).
	 * @return array|WP_Error { scores: {category: 0-100}, issues: {category: [{id,title,description,score}]} }, or WP_Error.
	 */
	public static function run( $url, $strategy = 'mobile', array $categories = self::CATEGORIES ) {
		$strategy   = ( 'desktop' === $strategy ) ? 'desktop' : 'mobile';
		$categories = array_values( array_intersect( $categories, self::CATEGORIES ) );
		if ( empty( $categories ) ) {
			$categories = self::CATEGORIES;
		}

		$params = array(
			'url'      => $url,
			'strategy' => $strategy,
		);
		$key    = self::get_api_key();
		if ( '' !== $key ) {
			$params['key'] = $key;
		}

		$query_parts = array();
		foreach ( $params as $k => $v ) {
			$query_parts[] = $k . '=' . rawurlencode( $v );
		}
		foreach ( $categories as $category ) {
			$query_parts[] = 'category=' . rawurlencode( $category );
		}

		$response = wp_remote_get(
			self::API_BASE . '?' . implode( '&', $query_parts ),
			array(
				'timeout' => 60, // Lighthouse runs live in Google's infra; can take 20-40s.
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}
		$code    = (int) wp_remote_retrieve_response_code( $response );
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( $code < 200 || $code >= 300 ) {
			return new WP_Error( 'aisa_pagespeed_api_error', $decoded['error']['message'] ?? "HTTP {$code}", array( 'status' => $code ) );
		}

		$lighthouse = $decoded['lighthouseResult'] ?? array();
		$scores     = array();
		foreach ( (array) ( $lighthouse['categories'] ?? array() ) as $key_name => $cat ) {
			if ( isset( $cat['score'] ) ) {
				$scores[ $key_name ] = (int) round( $cat['score'] * 100 );
			}
		}

		$audits = (array) ( $lighthouse['audits'] ?? array() );
		$issues = array();
		foreach ( (array) ( $lighthouse['categories'] ?? array() ) as $key_name => $cat ) {
			$rows = array();
			foreach ( (array) ( $cat['auditRefs'] ?? array() ) as $ref ) {
				$audit = $audits[ $ref['id'] ] ?? null;
				if ( ! $audit ) {
					continue;
				}
				// A null score means "informational, not pass/fail" (e.g. a
				// metric readout); only surface audits that actually failed
				// or scored poorly (< 0.9), the same threshold Lighthouse's
				// own report UI uses to flag "opportunities"/"diagnostics".
				if ( ! isset( $audit['score'] ) || null === $audit['score'] || $audit['score'] >= 0.9 ) {
					continue;
				}
				$rows[] = array(
					'id'          => $ref['id'],
					'title'       => $audit['title'] ?? '',
					'description' => wp_strip_all_tags( $audit['description'] ?? '' ),
					'score'       => (int) round( $audit['score'] * 100 ),
				);
			}
			usort( $rows, static fn( $a, $b ) => $a['score'] <=> $b['score'] );
			$issues[ $key_name ] = array_slice( $rows, 0, 10 );
		}

		return array(
			'scores' => $scores,
			'issues' => $issues,
		);
	}
}
