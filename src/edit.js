/**
 * Edit function
 *
 * Inspired by https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/document-outline/index.js
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  TextControl,
  PanelBody,
  BaseControl,
  CheckboxControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getPostHeadings } from './utils';
import TableOfContentList from './list';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
  const { levels, heading, sticky, stickyActive } = attributes;
  const levelsAvailable = [ 1, 2, 3, 4, 5, 6 ];

  const blocks         = useSelect( ( select ) => select( 'core/block-editor' ).getBlocks() );
  const latestHeadings = getPostHeadings( blocks, levels );

  const blockProps = useBlockProps( {
    className: {
      'blockparty-table-of-content': true,
      'blockparty-table-of-content--sticky': sticky
    },
    'aria-label': heading
  } );

  /**
   * Update levels
   * @param {string} text
   */
  const onCheckLevel = ( checked, level ) => {
    const checklistValues = levels.filter( value => value !== level )
    if ( checked ) {
      checklistValues.push( level );
    }
    setAttributes( { levels: checklistValues } );
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={ __( 'Settings', 'blockparty-table-of-content' ) }>
          <BaseControl
            label={ __( 'Heading levels', 'blockparty-table-of-content' ) }
            help={ __( 'Heading levels to show in the table of content. Other individually activated blocks may also appear.', 'blockparty-table-of-content' ) }
            className="components-base-control__toc-levels"
          >
            {
              levelsAvailable.map( ( level ) => (
                <CheckboxControl
                  key={ level }
                  label={ __( 'H' + level ) }
                  checked={ levels.includes( level ) ? true : false }
                  onChange={ ( checked ) => onCheckLevel( checked, level ) }
                />
              ) )
            }
          </BaseControl>

          <TextControl
            label={ __( 'Navigation label', 'blockparty-table-of-content' ) }
            help={ __( 'Not displayed, used for accessibility.', 'blockparty-table-of-content' ) }
            value={ heading }
            onChange={ ( heading ) => setAttributes( { heading } ) }
          />
        </PanelBody>

        <PanelBody title={ __( 'Styles', 'blockparty-table-of-content' ) }>
          <ToggleControl
            label={ __( 'Sticky', 'blockparty-table-of-content' ) }
            help={ __( 'Should the table of content be sticky when scrolling?', 'blockparty-table-of-content' ) }
            checked={ sticky }
            onChange={ ( sticky ) => setAttributes( { sticky } ) }
          />
          {
            sticky && (
              <ToggleControl
                label={ __( 'Highlight active link', 'blockparty-table-of-content' ) }
                help={ __( 'Should the visible headings links be highlighted in the table of content?', 'blockparty-table-of-content' ) }
                checked={ stickyActive }
                onChange={ ( stickyActive ) => setAttributes( { stickyActive } ) }
              />
            )
          }
        </PanelBody>
      </InspectorControls>
      <nav { ...blockProps }>
        <TableOfContentList headings={ latestHeadings } />
      </nav>
    </>
  );
}
