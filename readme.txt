=== Table of content ===
Contributors:      beapi
Tags:              block, table of content
Tested up to:      6.5
Stable tag:        1.0.5
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

== Description ==

This plugin adds a block to the WordPress block editor that allows you to add a table of content to your posts and pages.

== Screenshots ==

1. View of the block inside the WordPress editor.
1. View of the block inside the WordPress editor, styles settings opened.

== Changelog ==

= 1.0.5 =
* Rename plugin to "Blockparty Table of content"
* Improve heading level selector in the block editor with an icon toggle group
* Disable TOC link navigation in the editor preview
* Fix render when empty block parameters are provided
* Add WordPress Playground blueprint for live demo

= 1.0.4 =
* Fix bug of id added to many times

= 1.0.3 =
* Replace DOMDocument by regexp

= 1.0.2 =
* Fix special char convertion inside heading content in render_block method
* Check block_content & block variables in render_block method

= 1.0.1 =
* Add missing data-toc-level attribute to the toc list items in Editor.
* Fix regex on heading parse in render method.
* Fix Lint JS errors

= 1.0.0 =
* Initial release
