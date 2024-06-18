import { create, getTextContent } from '@wordpress/rich-text';

export default function TableOfContentList( { headings } ) {
	// Remove null elements
	const headingsFiltered = headings.filter( function ( heading ) {
		return heading != null;
	} );

	if ( ! headingsFiltered ) {
		return null;
	}

	return (
		<ol className="blockparty-table-of-content__list is-style-no-list-style">
			{ headingsFiltered.map( ( item, index ) => {
				return (
          <li
						key={ index }
						className="blockparty-table-of-content__list-item"
            data-toc-level={ item.level }
					>
						<a href={ `#block-${ item.clientId }` }>
							{ getTextContent(
								create( {
									html: item.title,
								} )
							) }
						</a>
					</li>
				);
			} ) }
		</ol>
	);
}
