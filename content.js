// Flag to track if bionic text is currently enabled
let bionicEnabled = false;

// Function to convert text to bionic format
function convertToBionicText(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }

  return text.split(' ').map(word => {
    if (word.length <= 1) return word;
    
    const midpoint = Math.ceil(word.length / 2);
    const firstHalf = word.substring(0, midpoint);
    const secondHalf = word.substring(midpoint);
    
    return `<strong>${firstHalf}</strong>${secondHalf}`;
  }).join(' ');
}

// Function to process text nodes
function processBionicText(node) {
  if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
    // Create a span element to hold the bionic text
    const span = document.createElement('span');
    span.innerHTML = convertToBionicText(node.nodeValue);
    span.classList.add('bionic-text-span');
    
    // Replace the text node with our span
    node.parentNode.replaceChild(span, node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Skip script, style, and already processed nodes
    if (
      node.tagName === 'SCRIPT' || 
      node.tagName === 'STYLE' || 
      node.tagName === 'NOSCRIPT' ||
      node.classList.contains('bionic-text-span')
    ) {
      return;
    }
    
    // Process child nodes (make a copy of the list as it will change during iteration)
    const childNodes = Array.from(node.childNodes);
    childNodes.forEach(child => processBionicText(child));
  }
}

// Function to restore original text
function restoreOriginalText() {
  const bionicSpans = document.querySelectorAll('.bionic-text-span');
  bionicSpans.forEach(span => {
    // Create a text node with the original text (without HTML tags)
    const originalText = span.textContent;
    const textNode = document.createTextNode(originalText);
    span.parentNode.replaceChild(textNode, span);
  });
}

// Function to toggle bionic text
function toggleBionicText() {
  if (bionicEnabled) {
    restoreOriginalText();
    bionicEnabled = false;
  } else {
    processBionicText(document.body);
    bionicEnabled = true;
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleBionicText') {
    toggleBionicText();
    sendResponse({ status: 'success', bionicEnabled });
  }
});