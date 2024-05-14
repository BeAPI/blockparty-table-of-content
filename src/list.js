import { create, getTextContent } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

export default function TableOfContentList( { headings } ) {
  // Remove null elements
  const headingsFiltered = headings.filter(function (heading) {
    return heading != null;
  });

  if ( ! headingsFiltered ) {
    return null;
  }

  return(
    <ol className="blockparty-table-of-content__list">
      { headingsFiltered.map( ( item, index ) => {
        return(
          <li key={ index } className="blockparty-table-of-content__list-item">
            <a href={ `#block-${ item.clientId }` }>
              { item.isEmpty
                ? <em>{ __( '(Empty heading)', 'blockparty-table-of-content' ) }</em>
                : getTextContent(
                  create( {
                    html: item.title,
                  } )
                ) }
            </a>
          </li>
        )
      } ) }
    </ol>
  )
}