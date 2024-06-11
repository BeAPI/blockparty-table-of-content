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
	<ol class="blockparty-table-of-content__list is-style-no-list-style">
		<?php foreach ( $headings as $heading ) : ?>
			<li class="blockparty-table-of-content__list-item" data-toc-active="false" data-toc-level="<?php echo esc_attr( $heading['level'] ); ?>">
				<?php
				printf(
					'<a href="#%s">%s</a>',
					esc_attr( $heading['id'] ),
					esc_html( $heading['title'] )
				);
				?>
			</li>
		<?php endforeach; ?>
	</ol>
</nav>
