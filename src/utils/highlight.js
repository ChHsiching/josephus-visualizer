import hljs from 'highlight.js/lib/core';
import c from 'highlight.js/lib/languages/c';
import * as anime from 'animejs';

// Register C language for syntax highlighting
hljs.registerLanguage('c', c);

/**
 * Highlight C code with gruvbox-dark theme
 * @param {string} code - The C code to highlight
 * @param {HTMLElement} element - The element to apply highlighting to
 */
export function highlightCCode(code, element) {
  element.innerHTML = hljs.highlight(code, { language: 'c' }).value;
  element.classList.add('hljs');
}

/**
 * Add line numbers to code
 * @param {string} code - The code to add line numbers to
 * @param {HTMLElement} container - Container element
 * @param {number} activeLine - Currently active line number
 */
export function addLineNumbers(code, container, activeLine = null) {
  const lines = code.split('\n');
  const highlightedCode = hljs.highlight(code, { language: 'c' }).value;
  const highlightedLines = highlightedCode.split('\n');

  let html = '';
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const isActive = lineNumber === activeLine;
    const lineClass = isActive ? 'code-line active' : 'code-line';

    html += `<span class="${lineClass}" data-line="${lineNumber}">`;
    html += `<span class="line-number">${lineNumber}</span>`;
    html += highlightedLines[index] || '';
    html += '</span>';
  });

  container.innerHTML = html;
  container.classList.add('hljs');
}

/**
 * Create animation for node highlighting
 * @param {HTMLElement} node - The node element to animate
 * @param {Object} options - Animation options
 */
export function animateNodeHighlight(node, options = {}) {
  const defaultOptions = {
    duration: 600,
    easing: 'easeInOutQuad',
    scale: 1.2,
    backgroundColor: '#458588',
    complete: () => {}
  };

  const animOptions = { ...defaultOptions, ...options };

  return anime({
    targets: node,
    scale: animOptions.scale,
    backgroundColor: animOptions.backgroundColor,
    duration: animOptions.duration,
    easing: animOptions.easing,
    complete: animOptions.complete
  });
}

/**
 * Create animation for node removal
 * @param {HTMLElement} node - The node element to animate removal
 * @param {Function} callback - Callback function after animation
 */
export function animateNodeRemoval(node, callback = () => {}) {
  try {
    return anime({
      targets: node,
      scale: [1, 0],
      opacity: [1, 0],
      rotate: '360deg',
      duration: 800,
      easing: 'easeInBack',
      complete: callback
    });
  } catch (error) {
    console.warn('Failed to animate node removal:', error);
    // Execute callback immediately and return resolved promise
    callback();
    return Promise.resolve();
  }
}

/**
 * Create counting animation
 * @param {Array} nodes - Array of node elements to count through
 * @param {number} currentIndex - Current index in the counting process
 * @param {number} targetIndex - Target index to count to
 * @param {Function} onComplete - Callback when counting completes
 */
export function animateCounting(nodes, currentIndex, targetIndex, onComplete = () => {}) {
  const nodesToAnimate = [];

  // Create circular array traversal
  for (let i = 0; i < targetIndex - currentIndex; i++) {
    const nodeIndex = (currentIndex + i) % nodes.length;
    nodesToAnimate.push(nodes[nodeIndex]);
  }

  return anime({
    targets: nodesToAnimate,
    scale: [1, 1.1, 1],
    backgroundColor: ['#3c3836', '#d79921', '#3c3836'],
    duration: 300,
    delay: anime.stagger(100),
    easing: 'easeInOutQuad',
    complete: onComplete
  });
}

/**
 * Create circle link animation
 * @param {HTMLElement} link - The link element to animate
 */
export function animateLinkHighlight(link) {
  try {
    // For SVG line elements, we need to get the computed style
    const computedStyle = getComputedStyle(link);
    const length = link.getTotalLength?.() || 100;

    return anime({
      targets: link,
      strokeDashoffset: [length, 0],
      duration: 600,
      easing: 'easeInOutQuad'
    });
  } catch (error) {
    console.warn('Failed to animate link highlight:', error);
    // Return a resolved promise as fallback
    return Promise.resolve();
  }
}

/**
 * Smooth scroll to specific line
 * @param {HTMLElement} container - The container element
 * @param {number} lineNumber - The line number to scroll to
 */
export function scrollToLine(container, lineNumber) {
  const lineElement = container.querySelector(`[data-line="${lineNumber}"]`);
  if (lineElement) {
    lineElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

/**
 * Create fade in animation for elements
 * @param {HTMLElement} element - Element to animate
 * @param {number} delay - Animation delay in milliseconds
 */
export function animateFadeIn(element, delay = 0) {
  return anime({
    targets: element,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 500,
    delay: delay,
    easing: 'easeOutQuad'
  });
}

/**
 * Create pulse animation for active elements
 * @param {HTMLElement|HTMLElement[]} element - Element to pulse
 * @param {boolean} infinite - Whether to loop infinitely
 */
export function animatePulse(element, infinite = false) {
  try {
    const targets = Array.isArray(element) ? element : element;

    const options = {
      targets: targets,
      scale: [1, 1.05, 1],
      duration: 1000,
      easing: 'easeInOutQuad'
    };

    if (infinite) {
      options.loop = true;
    } else {
      options.direction = 'alternate';
      options.loop = 2;
    }

    return anime(options);
  } catch (error) {
    console.warn('Failed to animate pulse:', error);
    return Promise.resolve();
  }
}

// Export anime.js for direct use if needed
export { anime };