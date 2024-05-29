// eslint-disable-next-line no-undef
const TOCBlocksAllowed = blockpartyTOC.allowedBlocks;

/**
 * Returns an array of heading blocks enhanced with the following properties:
 * title   - The heading content.
 * clientId - The block client ID.
 *
 * @param {Array} blocks An array of blocks.
 * @param {Array} levels An array of heading levels to include.
 *
 * @return {Array} An array of heading blocks enhanced with the properties described above.
 */
export const getPostHeadings = ( blocks = [], levels ) => {
  return blocks.flatMap( ( block = {} ) => {
    if ( ( 'core/heading' === block.name && levels?.includes( block.attributes.level ) ) || ( TOCBlocksAllowed.includes( block.name ) && block.attributes.showInTOC ) ) {
      return {
        title: block.attributes.content || block.attributes.text,
        clientId: block.clientId,
      };
    }
    // Recursively get headings from inner blocks.
    return getPostHeadings( block.innerBlocks, levels );
  } );
};