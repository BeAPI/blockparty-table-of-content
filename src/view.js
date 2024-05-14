function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= -1 &&
    rect.left >= 0 &&
    rect.bottom <=
    (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const handler = (entries) => {
  // Get all entries that have just come into the viewport
  const allHeadings = new Set(
    entries
      .filter((entry) => entry.isIntersecting == true)
      .map((entry) => entry.target)
  );

  let currentHeading;

  for (let i = 0; i < headings.length; i++) {
    currentHeading = headings[i];
    // If the section is in the viewport or it has just intersected, set it as active
    if (isElementInViewport(currentHeading) || allHeadings.has(currentHeading)) {
      // Disable all links and active the current one.
      tocLinks.forEach((link) => link.parentElement.setAttribute('data-toc-active', 'false'));
      const link = document.querySelector(`a[href="#${currentHeading.id}"]`)
      if (link) {
        link.parentElement.setAttribute('data-toc-active', 'true');
      }
      break;
    }
  }
};

// Create a new observer with the handler and apply it to all links in table of content.
const observer = new IntersectionObserver(handler);
const tocLinks = document.querySelectorAll('.blockparty-table-of-content--sticky-active li a');
const headings = [];

if ( tocLinks ) {
  const idsFromLinks = Array.from(tocLinks).map((el) => {
    return el.getAttribute('href').replace('#', '');
  });

  if (idsFromLinks.length) {
    idsFromLinks.forEach((id) => {
      const heading = document.getElementById(id);
      if (heading) {
        headings.push(heading);
        observer.observe(heading);
      }
    });
  }
}
