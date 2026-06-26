<?php
/**
 * Plugin Name:       Blockparty Table of content
 * Description:       A table of content block.
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Version:           1.0.5
 * Author:            Be API Technical team
 * Author URI:        https://beapi.fr
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blockparty-table-of-content
 *
 * @package           create-block
 */

namespace Beapi\Toc_Block;

define( 'BEAPI_TOC_BLOCK_VERSION', '1.0.5' );
define( 'BEAPI_TOC_BLOCK_URL', plugin_dir_url( __FILE__ ) );
define( 'BEAPI_TOC_BLOCK_DIR', plugin_dir_path( __FILE__ ) );
define( 'BEAPI_TOC_BLOCK_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
define( 'BEAPI_TOC_BLOCK_CACHE_GROUP', 'block-toc-headings-list' );

define( 'BEAPI_TOC_BLOCK_THIRD_BLOCKS_INCLUDED', [ 'core/paragraph' ] );

function init() {
	// Load available translations.
	load_plugin_textdomain( 'blockparty-table-of-content', false, dirname( BEAPI_TOC_BLOCK_PLUGIN_BASENAME ) . '/languages' );

	/** @psalm-suppress InvalidArgument -- script key use for WP 6.0 */
	register_block_type(
		__DIR__ . '/build',
		[
			'render_callback' => __NAMESPACE__ . '\\table_of_content_render_callback',
			'script'          => 'blockparty-table-of-content-view-script', // For WP < 6.1
		]
	);

	// Load translations for JS
	wp_set_script_translations( 'blockparty-table-of-content-editor-script', 'blockparty-table-of-content', BEAPI_TOC_BLOCK_DIR . '/languages' );

	// Pass PHP values to main script
	$constants = [
		'allowedBlocks' => apply_filters( 'toc_third_blocks_included', BEAPI_TOC_BLOCK_THIRD_BLOCKS_INCLUDED ),
	];
	wp_localize_script( 'blockparty-table-of-content-editor-script', 'blockpartyTOC', $constants );

	add_filter( 'render_block', __NAMESPACE__ . '\\render_block', 10, 2 );

	do_action( 'blockparty-table-of-content-block_init' );
}

add_action( 'init', __NAMESPACE__ . '\\init' );

/**
 * Block render callback.
 *
 * @param array $attributes
 * @param string $content
 * @param \WP_Block $block
 */
function table_of_content_render_callback( $attributes, $content, $block ): string {
	$current_post = \get_post();

	if ( ! ( $current_post instanceof \WP_Post ) ) {
		return '';
	}

	$levels        = $attributes['levels'] ?? [];
	$sticky        = $attributes['sticky'] ?? true;
	$sticky_active = $attributes['stickyActive'] ?? true;

	$classnames = [ 'blockparty-table-of-content' ];
	if ( $sticky ) {
		$classnames[] = 'blockparty-table-of-content--sticky';

		if ( $sticky_active ) {
			$classnames[] = 'blockparty-table-of-content--sticky-active';
		}
	}

	$styles = '';
	if ( isset( $attributes['stickyTop'] ) && ! empty( $attributes['stickyTop'] ) ) {
		$styles .= '--blockparty-table-of-content--sticky-top: ' . $attributes['stickyTop'] . ';';
	}
	if ( isset( $attributes['linksColor'] ) && ! empty( $attributes['linksColor'] ) ) {
		$styles .= '--blockparty-table-of-content--links-color: ' . $attributes['linksColor'] . ';';
	}
	if ( isset( $attributes['linksActiveColor'] ) && ! empty( $attributes['linksActiveColor'] ) ) {
		$styles .= '--blockparty-table-of-content--links-active-color: ' . $attributes['linksActiveColor'] . ';';
	}

	/**
	 * Filter block's classnames.
	 *
	 * @param array $classnames list of css class
	 * @param array $args \WP_Query args
	 * @param array $attributes block's attributes
	 * @param \WP_Block $block block's \WP_Block instance
	 */
	$classnames = apply_filters( 'blockparty/table_of_content/classnames', $classnames, $attributes, $block );
	$classnames = array_map( 'sanitize_html_class', $classnames );

	/**
	 * Filter block's template slug.
	 *
	 * Template must be located in the theme as it will be loaded via `get_template_part`.
	 *
	 * @param string $template_slug block's template slug
	 * @param array $attributes block's attributes
	 * @param \WP_Block $block block's \WP_Block instance
	 */
	$template_slug = apply_filters( 'blockparty/table_of_content/template_slug', 'components/gutenberg/table-of-content', $attributes, $block );

	/**
	 * Filter block's template name.
	 *
	 * @param string $template_name block's template name
	 * @param string $template_slug block's template slug
	 * @param array $attributes block's attributes
	 * @param \WP_Block $block block's \WP_Block instance
	 */
	$template_name = apply_filters( 'blockparty/table_of_content/template_name', '', $template_slug, $attributes, $block );

	/**
	 * Filter block's template args.
	 *
	 * @param string $template_name block's template name
	 * @param string $template_slug block's template slug
	 * @param array $attributes block's attributes
	 * @param \WP_Block $block block's \WP_Block instance
	 */
	$template_args = apply_filters(
		'blockparty/table_of_content/template_args',
		[
			'block_attributes'         => $attributes,
			'block_wrapper_attributes' => get_block_wrapper_attributes(
				[
					'class' => implode( ' ', $classnames ),
					'style' => $styles,
				]
			),
			'is_preview'               => isset( $_GET['is_block_editor'] ), //phpcs:ignore WordPress.Security.NonceVerification.Recommended
			'headings'                 => get_headings( $current_post, $levels ),
		],
		$template_slug,
		$template_name,
		$attributes,
		$block
	);

	ob_start();
	$rendered      = get_template_part( $template_slug, $template_name, $template_args );
	$block_content = ob_get_clean();

	// If block render was successful return the content.
	if ( false !== $rendered ) {
		return $block_content;
	}

	// Otherwise use default template.
	ob_start();

	load_template( plugin_dir_path( __FILE__ ) . '/views/table-of-content.php', false, $template_args );

	return ob_get_clean();
}

add_action( 'clean_post_cache', __NAMESPACE__ . '\\clean_post_cache' );

/**
 * Delete the post cache after a contribution
 *
 * @param integer $post_id
 *
 * @return void
 */
function clean_post_cache( int $post_id ) {
	wp_cache_delete( $post_id, BEAPI_TOC_BLOCK_CACHE_GROUP );
}

/**
 * Get headings from a post content.
 *
 * @param \WP_Post $post
 * @param array $levels
 *
 * @return array
 */
function get_headings( \WP_Post $post, $levels ): array {
	$found = null;
	$data  = wp_cache_get( $post->ID, BEAPI_TOC_BLOCK_CACHE_GROUP, false, $found );
	if ( $found ) {
		return $data;
	}

	$headings = parse_headings_blocks( parse_blocks( $post->post_content ), $levels );

	wp_cache_set( $post->ID, $headings, BEAPI_TOC_BLOCK_CACHE_GROUP );

	return $headings;
}

/**
 * Parse blocks from a post content.
 *
 * @param array $blocks
 * @param array $levels
 *
 * @return array Array of headings in format [ 'heading-slug' => 'Heading Title' ]
 */
function parse_headings_blocks( $blocks, $levels ): array {
	$headings = [];

	if ( empty( $blocks ) ) {
		return $headings;
	}

	foreach ( $blocks as $block ) {
		$is_block_in_toc = is_block_in_toc( $block );

		if ( ! empty( $block['innerBlocks'] ) ) {
			// Loop inside inner blocks
			$headings = array_merge( $headings, parse_headings_blocks( $block['innerBlocks'], $levels ) );
		} elseif ( $is_block_in_toc ) {
			$block_level = 2; // Default level for non-heading blocks.
			if ( 'core/heading' === $block['blockName'] ) {
				$block_level = $block['attrs']['level'] ?? 2; // H2 do not have level attribute.
				if ( ! empty( $levels ) && ! in_array( $block_level, $levels ) ) {
					continue;
				}
			}

			$block_content = $block['innerHTML'];
			if ( empty( $block_content ) ) {
				continue;
			}

			$heading = [
				'level' => $block_level,
				'title' => wp_strip_all_tags( $block_content ),
			];

			// Use existing ID or generate one if don't exist.
			if ( preg_match( '/^<\w+[^>]*\s+id="([^"]*)"[^>]*>/i', trim( $block_content ), $matches ) ) {
				$heading['id'] = $matches[1];
			} else {
				$heading['id'] = sanitize_title( wp_strip_all_tags( $block_content ) );
			}

			$headings[] = $heading;
		}
	}

	return $headings;
}

/**
 * Add an ID to a block content.
 *
 * @param string $block_content
 * @param array $block
 *
 * @return string
 */
function render_block( $block_content, $block ): string {
	if ( empty( $block_content ) || empty( $block ) ) {
		return $block_content;
	}

	$is_block_in_toc = is_block_in_toc( $block );

	if ( $is_block_in_toc ) {
		// Regex to find id attribute only in the first tag occurrence
		if ( preg_match( '/^<\w+[^>]*\s+id="([^"]*)"[^>]*>/i', trim( $block_content ), $matches ) ) {
			return $block_content;
		}

		$slug = sanitize_title( wp_strip_all_tags( $block_content ) );

		return preg_replace( '/>/i', ' id="' . $slug . '">', $block_content, 1 );

	}

	return $block_content;
}

/**
 * Check if a block is a Heading or if it's in the third blocks included and show in TOC attribute is active
 *
 * @param array $block
 *
 * @return bool
 */
function is_block_in_toc( $block ): bool {
	if ( empty( $block ) ) {
		return false;
	}

	// Other blocks than heading to include in the TOC
	$blocks_included = apply_filters( 'toc_third_blocks_included', BEAPI_TOC_BLOCK_THIRD_BLOCKS_INCLUDED );

	if ( 'core/heading' === $block['blockName'] || ( in_array( $block['blockName'], $blocks_included, true ) && isset( $block['attrs']['showInTOC'] ) && $block['attrs']['showInTOC'] ) ) {
		return true;
	}

	return false;
}
