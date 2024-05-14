// eslint-disable-next-line no-undef
const TOCBlocksAllowed = blockpartyTOC.allowedBlocks;

// Check if block has attributes.content or attributes.text
export const isEmptyBlock = (block) => {
  return !block.attributes.content && !block.attributes.text;
}


/**
 * Returns an array of heading blocks enhanced with the following properties:
 * title   - The heading content.
 * clientId - The block client ID.
 * isEmpty - Flag indicating if the heading has no content.
 *
 * @param {?Array} blocks An array of blocks.
 *
 * @return {Array} An array of heading blocks enhanced with the properties described above.
 */
export const getPostHeadings = ( blocks = [], levels ) => {
  return blocks.flatMap( ( block = {} ) => {
    if ( ( 'core/heading' === block.name && levels?.includes( block.attributes.level ) ) || ( TOCBlocksAllowed.includes( block.name ) && block.attributes.showInTOC ) ) {
      return {
        title: block.attributes.content || block.attributes.text,
        clientId: block.clientId,
        isEmpty: isEmptyBlock(block),
      };
    }
    // Recursively get headings from inner blocks.
    return getPostHeadings( block.innerBlocks, levels );
  } );
};