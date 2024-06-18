/**
 * Edit function
 *
 * Inspired by https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/document-outline/index.js
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	TextControl,
	PanelBody,
	BaseControl,
	CheckboxControl,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getPostHeadings } from './utils';
import TableOfContentList from './list';
import './editor.scss';

const LEVELS_AVAILABLE = [ 1, 2, 3, 4, 5, 6 ];

export default function Edit( { attributes, setAttributes } ) {
	const {
		levels,
		heading,
		sticky,
		stickyTop,
		stickyActive,
		linksColor,
		linksActiveColor,
	} = attributes;

	const blocks = useSelect( ( select ) =>
		select( 'core/block-editor' ).getBlocks()
	);
	const latestHeadings = getPostHeadings( blocks, levels );

	const blockProps = useBlockProps( {
		className: {
			'blockparty-table-of-content': true,
			'blockparty-table-of-content--sticky': sticky,
		},
		'aria-label': heading,
		style: {
			'--blockparty-table-of-content--sticky-top': stickyTop,
			'--blockparty-table-of-content--links-color': linksColor,
			'--blockparty-table-of-content--links-active-color':
				linksActiveColor,
		},
	} );

	/**
	 * Update levels
	 *
	 * @param {string} checked
	 * @param {number} level
	 */
	const onCheckLevel = ( checked, level ) => {
		const checklistValues = levels.filter( ( value ) => value !== level );
		if ( checked ) {
			checklistValues.push( level );
		}
		setAttributes( { levels: checklistValues } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Content', 'blockparty-table-of-content' ) }
				>
					<BaseControl
						label={ __(
							'Heading levels',
							'blockparty-table-of-content'
						) }
						help={ __(
							'Heading levels to show in the table of content. Other individually activated blocks may also appear.',
							'blockparty-table-of-content'
						) }
						className="components-base-control__toc-levels"
					>
						{ LEVELS_AVAILABLE.map( ( level ) => (
							<CheckboxControl
								key={ level }
								label={ __( 'H' + level ) }
								checked={
									levels.includes( level ) ? true : false
								}
								onChange={ ( checked ) =>
									onCheckLevel( checked, level )
								}
							/>
						) ) }
					</BaseControl>

					<TextControl
						label={ __(
							'Navigation label',
							'blockparty-table-of-content'
						) }
						help={ __(
							'Not displayed, used for accessibility.',
							'blockparty-table-of-content'
						) }
						value={ heading }
						onChange={ ( heading ) => setAttributes( { heading } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelColorSettings
					title={ __( 'Colors', 'blockparty-table-of-content' ) }
					colorSettings={ [
						{
							value: linksColor,
							onChange: ( linksColor ) =>
								setAttributes( { linksColor } ),
							label: __(
								'Links color',
								'blockparty-table-of-content'
							),
						},
						{
							value: linksActiveColor,
							onChange: ( linksActiveColor ) =>
								setAttributes( { linksActiveColor } ),
							label: __(
								'Links active color',
								'blockparty-table-of-content'
							),
						},
					] }
				/>
				<PanelBody
					title={ __(
						'Scroll behavior',
						'blockparty-table-of-content'
					) }
				>
					<ToggleControl
						label={ __(
							'Stick to top of screen',
							'blockparty-table-of-content'
						) }
						help={ __(
							'Should the table of content be sticky when scrolling?',
							'blockparty-table-of-content'
						) }
						checked={ sticky }
						onChange={ ( sticky ) => setAttributes( { sticky } ) }
					/>
					{ sticky && (
						<>
							<UnitControl
								label={ __(
									'Top distance',
									'blockparty-table-of-content'
								) }
								help={ __(
									'Distance from the top of the screen when scrolling.',
									'blockparty-table-of-content'
								) }
								value={ stickyTop }
								units={ [
									{ value: 'px', label: 'px', default: 0 },
									{ value: 'rem', label: 'rem', default: 0 },
								] }
								onChange={ ( stickyTop ) =>
									setAttributes( { stickyTop } )
								}
							/>
							<ToggleControl
								label={ __(
									'Highlight active link',
									'blockparty-table-of-content'
								) }
								help={ __(
									'Should the visible headings links be highlighted in the table of content?',
									'blockparty-table-of-content'
								) }
								checked={ stickyActive }
								onChange={ ( stickyActive ) =>
									setAttributes( { stickyActive } )
								}
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			{ latestHeadings.length > 0 ? (
				<nav { ...blockProps }>
					<TableOfContentList headings={ latestHeadings } />
				</nav>
			) : (
				<p { ...blockProps }>
					{ __(
						'No blocks found to show in Table of content',
						'blockparty-table-of-content'
					) }
				</p>
			) }
		</>
	);
}
