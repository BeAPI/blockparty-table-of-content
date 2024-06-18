# Table of content block for WordPress

This plugin adds a block to the WordPress block editor that allows you to add a table of content to your posts and pages.

![](.wordpress.org/screenshot-1.png?raw=true)

![](.wordpress.org/screenshot-2.png?raw=true)

## For developers

### Allow more blocks to be included in the Table of content
By default, the Paragraph block get a custom setting to be included in the Table of content (Advanced > Table of content).
Use the `toc_third_blocks_included` filter to allow more blocks :

```
add_filter( 'toc_third_blocks_included', 'custom_toc_third_blocks_included', 10, 1 );
function custom_toc_third_blocks_included( $blocks ) {
	$blocks[] = 'core/button';
	return $blocks;
}

```