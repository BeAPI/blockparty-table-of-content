/**
 * Edit function
 *
 * Inspired by https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/document-outline/index.js
 */

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	TextControl,
	PanelBody,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	headingLevel1,
	headingLevel2,
	headingLevel3,
	headingLevel4,
	headingLevel5,
	headingLevel6,
} from '@wordpress/icons';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getPostHeadings } from './utils';
import TableOfContentList from './list';
import './editor.scss';

const LEVELS_AVAILABLE = [ 1, 2, 3, 4, 5, 6 ];

const HEADING_LEVEL_ICONS = {
	1: headingLevel1,
	2: headingLevel2,
	3: headingLevel3,
	4: headingLevel4,
	5: headingLevel5,
	6: headingLevel6,
};

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

	const lastChangedLevel = useRef( null );

	const onCheckLevel = ( checked, level ) => {
		const checklistValues = levels.filter( ( value ) => value !== level );
		if ( checked ) {
			checklistValues.push( level );
		}
		setAttributes( { levels: checklistValues } );
	};

	const onLevelChange = ( newValue ) => {
		if ( newValue === undefined ) {
			if ( lastChangedLevel.current !== null ) {
				onCheckLevel( false, lastChangedLevel.current );
				lastChangedLevel.current = null;
			}
			return;
		}

		const level = Number( newValue );
		lastChangedLevel.current = level;
		onCheckLevel( ! levels.includes( level ), level );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Content', 'blockparty-table-of-content' ) }
				>
					<ToggleGroupControl
						label={ __(
							'Heading levels',
							'blockparty-table-of-content'
						) }
						help={ __(
							'Heading levels to show in the table of content. Other individually activated blocks may also appear.',
							'blockparty-table-of-content'
						) }
						isDeselectable
						__next40pxDefaultSize
						onChange={ onLevelChange }
						className={ classnames(
							'components-base-control__toc-levels',
							levels.map(
								( level ) =>
									`components-base-control__toc-levels--level-${ level }-selected`
							)
						) }
					>
						{ LEVELS_AVAILABLE.map( ( level ) => (
							<ToggleGroupControlOptionIcon
								key={ level }
								value={ level }
								icon={ HEADING_LEVEL_ICONS[ level ] }
								label={ sprintf(
									/* translators: %d: heading level e.g. 1, 2, 3 */
									__(
										'Heading %d',
										'blockparty-table-of-content'
									),
									level
								) }
							/>
						) ) }
					</ToggleGroupControl>

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
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelColorSettings
					title={ __( 'Colors', 'blockparty-table-of-content' ) }
					colorSettings={ [
						{
							value: linksColor,
							onChange: ( value ) =>
								setAttributes( { linksColor: value } ),
							label: __(
								'Links color',
								'blockparty-table-of-content'
							),
						},
						{
							value: linksActiveColor,
							onChange: ( value ) =>
								setAttributes( { linksActiveColor: value } ),
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
						onChange={ ( value ) =>
							setAttributes( { sticky: value } )
						}
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
								onChange={ ( value ) =>
									setAttributes( { stickyTop: value } )
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
								onChange={ ( value ) =>
									setAttributes( { stickyActive: value } )
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
