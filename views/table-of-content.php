<?php
/**
 * Default Table of content Block render
 *
 * @var array $args {
 * @type array $block_attributes
 * @type string $block_wrapper_attributes
 * @type array $headings
 * @type bool $is_preview
 * }
 */

$headings = $args['headings'] ?? [];
$levels   = $args['block_attributes']['levels'] ?? [];
$heading  = $args['block_attributes']['heading'] ?? __( 'Table of content', 'blockparty-table-of-content' );

if ( empty( $headings ) || empty( $levels ) ) {
	return;
}
?>
<nav <?php echo $args['block_wrapper_attributes']; //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> aria-label="<?php echo esc_attr( $heading ); ?>">
	<ol class="blockparty-table-of-content__list">
		<?php foreach ( $headings as $heading_slug => $heading_title ) : ?>
			<li class="blockparty-table-of-content__list-item" data-toc-active="false">
				<?php
				printf(
					'<a href="#%s">%s</a>',
					esc_attr( $heading_slug ),
					esc_html( $heading_title )
				);
				?>
			</li>
		<?php endforeach; ?>
	</ol>
</nav>
