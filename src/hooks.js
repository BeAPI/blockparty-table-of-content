/* Add custom attribute to blocks */
import { __ } from '@wordpress/i18n';

// Get allowed blocks, declared in PHP.
// eslint-disable-next-line no-undef
const TOCBlocksAllowed = blockpartyTOC.allowedBlocks;

import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorAdvancedControls } from '@wordpress/block-editor';
import { BaseControl, ToggleControl } from '@wordpress/components';

/**
 * Declare the show in TOC Attribute
 * @param settings
 * @param name
 */
const setTOCSidebarAttribute = ( settings, name ) => {
	if ( ! TOCBlocksAllowed.includes( name ) ) {
		return settings;
	}

	return Object.assign( {}, settings, {
		attributes: Object.assign( {}, settings.attributes, {
			showInTOC: {
				type: 'boolean',
				default: false,
			},
		} ),
	} );
};

wp.hooks.addFilter(
	'blocks.registerBlockType',
	'blockparty/set-sidebar-select-attribute',
	setTOCSidebarAttribute
);

/**
 * Add Table of content settings to blocks
 */
const addTOCAttributes = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// If current block is not allowed
		if ( ! TOCBlocksAllowed.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes, isSelected } = props;
		const { showInTOC } = attributes;

		return (
			<>
				<BlockEdit { ...props } />
				{ isSelected && (
					<InspectorAdvancedControls>
						<BaseControl
							label={ __(
								'Table of content',
								'blockparty-table-of-content'
							) }
						>
							<ToggleControl
								label={ __(
									'Display in table of content',
									'blockparty-table-of-content'
								) }
								checked={ showInTOC }
								onChange={ ( showInTOC ) =>
									setAttributes( { showInTOC } )
								}
							/>
						</BaseControl>
					</InspectorAdvancedControls>
				) }
			</>
		);
	};
}, 'addTOCAttributes' );

wp.hooks.addFilter(
	'editor.BlockEdit',
	'blockparty/add-toc-attributes',
	addTOCAttributes
);
