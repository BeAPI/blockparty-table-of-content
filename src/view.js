'use strict';

class TOC {
  constructor(tocNodes) {
    this.toc = tocNodes;

    this.tocLinks = this.toc.querySelectorAll('.blockparty-table-of-content--sticky-active li a');
    this.headings = [];

    const observer = new IntersectionObserver(this.headingsScrollObserver);

    if ( this.tocLinks ) {
      const idsFromLinks = Array.from(this.tocLinks).map((el) => {
        return el.getAttribute('href').replace('#', '');
      });

      if (idsFromLinks.length) {
        idsFromLinks.forEach((id) => {
          const heading = document.getElementById(id);
          if (heading) {
            this.headings.push(heading);
            observer.observe(heading);
          }
        });
      }
    }
  }

  /**
   * Check if an element is in the viewport
   *
   * @param {HTMLElement} el
   * @return {boolean}
   */
  isElementInViewport = ( el ) => {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= -1 &&
      rect.left >= 0 &&
      rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Observer for the headings
   *
   * @param {IntersectionObserverEntry[]} entries
   */
  headingsScrollObserver = (entries) => {
    // Get all entries that have just come into the viewport
    const allHeadings = new Set(
      entries
        .filter((entry) => entry.isIntersecting == true)
        .map((entry) => entry.target)
    );

    let currentHeading;

    for (let i = 0; i < this.headings.length; i++) {
      currentHeading = this.headings[i];
      // If the section is in the viewport or it has just intersected, set it as active
      if (this.isElementInViewport(currentHeading) || allHeadings.has(currentHeading)) {
        // Disable all links and active the current one.
        this.tocLinks.forEach((link) => link.parentElement.setAttribute('data-toc-active', 'false'));
        const link = this.toc.querySelector(`a[href="#${currentHeading.id}"]`)
        if (link) {
          link.parentElement.setAttribute('data-toc-active', 'true');
        }
        break;
      }
    }
  };
}

window.addEventListener( 'load', function () {
  const tocBlocks = document.querySelectorAll( '.blockparty-table-of-content' );
  for ( let i = 0; i < tocBlocks.length; i++ ) {
    new TOC( tocBlocks[ i ] );
  }
} );