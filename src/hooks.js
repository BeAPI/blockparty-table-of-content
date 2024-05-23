/* Add custom attribute to blocks */
import { __ } from '@wordpress/i18n';

// Get allowed blocks, declared in PHP.
// eslint-disable-next-line no-undef
const TOCBlocksAllowed = blockpartyTOC.allowedBlocks;

import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorAdvancedControls, store as blockEditorStore } from '@wordpress/block-editor';
import { BaseControl, ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

import { generateAnchor, setAnchor } from './autogenerate-anchors';

/**
 * Declare the show in TOC Attribute
 */
const setTOCSidebarAttribute = ( settings, name ) => {
  if ( ! TOCBlocksAllowed.includes( name ) ) {
    return settings;
  }

  return Object.assign( {}, settings, {
    attributes: Object.assign( {}, settings.attributes, {
      showInTOC: {
        type: 'boolean',
        default: false
      }
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
      return (
        <BlockEdit { ...props } />
      );
    }

    const { attributes, setAttributes, isSelected } = props;
    const { showInTOC } = attributes;

    return (
      <>
        <BlockEdit { ...props } />
        { isSelected && (
          <InspectorAdvancedControls>
            <BaseControl
              label={ __( 'Table of content', 'blockparty-table-of-content' ) }
            >
              <ToggleControl
                label={ __( 'Display in table of content', 'blockparty-table-of-content' ) }
                checked={ showInTOC }
                onChange={ ( showInTOC ) => setAttributes( { showInTOC } ) }
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

/**
 * Add anchors to blocks
 */
const addAnchors = createHigherOrderComponent( ( BlockEdit ) => {
  return ( props ) => {

    const { name, attributes, setAttributes, isSelected, clientId } = props;
    const { anchor, content } = attributes;

    const { canGenerateAnchors } = useSelect( ( select ) => {
      const { getGlobalBlockCount, getSettings } = select( blockEditorStore );

      return {
        canGenerateAnchors:
          ( 'core/heading' === name || ( TOCBlocksAllowed.includes( name ) && attributes.showInTOC ) ) &&
          getGlobalBlockCount( 'blockparty/table-of-content' ) > 0,
      };
    }, [] );

    const { __unstableMarkNextChangeAsNotPersistent } =
      useDispatch( blockEditorStore );

    // Initially set anchor for headings that have content but no anchor set.
    // This is used when : inserting a TOC block inside post containing headings, transforming a block to heading, or for legacy anchors.
    useEffect( () => {
      if ( ! canGenerateAnchors ) {
        return;
      }

      if ( ! anchor && content ) {
        // This side-effect should not create an undo level.
        __unstableMarkNextChangeAsNotPersistent();
        setAttributes( {
          anchor: generateAnchor( clientId, content ),
        } );
      }
      setAnchor( clientId, anchor );

      // Remove anchor map when block unmounts.
      return () => setAnchor( clientId, null );
    }, [ anchor, content, clientId, canGenerateAnchors ] );

    // Generate anchors when inserting/editing a block.
    if (
      canGenerateAnchors &&
      ( ! anchor ||
        ! content ||
        generateAnchor( clientId, content ) === anchor )
    ) {
      setAttributes( {
        anchor: generateAnchor( clientId, content ),
      } )
    }

    return (
      <BlockEdit { ...props } />
    );
  };
}, 'addAnchors' );

wp.hooks.addFilter(
  'editor.BlockEdit',
  'blockparty/add-anchors',
  addAnchors
);

