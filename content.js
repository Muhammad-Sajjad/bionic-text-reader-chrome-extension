// Flag to track if bionic text is currently enabled
let bionicEnabled = false;

// Flag to track if we're viewing a PDF
let isPdfViewer = false;

// Function to detect if the current page is a PDF viewer
function detectPdfViewer() {
  // Check if we're in Chrome's PDF viewer
  isPdfViewer = (
    document.querySelector('embed[type="application/pdf"]') !== null ||
    document.querySelector('object[type="application/pdf"]') !== null ||
    document.querySelector('iframe[src$=".pdf"]') !== null ||
    location.pathname.toLowerCase().endsWith('.pdf') ||
    document.querySelector('.pdfViewer') !== null
  );
  
  return isPdfViewer;
}

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

// Function to process PDF text layers
function processPdfTextLayers() {
  // Target the text layers in Chrome's PDF viewer
  const textLayers = document.querySelectorAll('.textLayer');
  
  if (textLayers.length === 0) {
    // If text layers aren't found, try again after a short delay
    // This helps when the PDF is still loading
    setTimeout(processPdfTextLayers, 1000);
    return;
  }
  
  textLayers.forEach(layer => {
    // Process each text span in the layer
    const textSpans = layer.querySelectorAll('span:not(.bionic-processed)');
    
    textSpans.forEach(span => {
      // Skip empty spans or those already processed
      if (!span.textContent.trim() || span.classList.contains('bionic-processed')) {
        return;
      }
      
      // Store original text content for restoration later
      if (!span.hasAttribute('data-original-text')) {
        span.setAttribute('data-original-text', span.textContent);
      }
      
      // Apply bionic formatting
      span.innerHTML = convertToBionicText(span.getAttribute('data-original-text'));
      span.classList.add('bionic-processed');
    });
  });
}

// Function to restore original PDF text
function restorePdfText() {
  const processedSpans = document.querySelectorAll('.textLayer .bionic-processed');
  
  processedSpans.forEach(span => {
    if (span.hasAttribute('data-original-text')) {
      span.textContent = span.getAttribute('data-original-text');
      span.classList.remove('bionic-processed');
    }
  });
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
  // Check if we're in a PDF viewer
  if (detectPdfViewer()) {
    if (bionicEnabled) {
      restorePdfText();
      bionicEnabled = false;
    } else {
      processPdfTextLayers();
      bionicEnabled = true;
      
      // Set up a mutation observer to handle dynamically loaded PDF pages
      setupPdfMutationObserver();
    }
  } else {
    // Regular webpage handling
    if (bionicEnabled) {
      restoreOriginalText();
      bionicEnabled = false;
    } else {
      processBionicText(document.body);
      bionicEnabled = true;
    }
  }
}

// Function to set up mutation observer for PDF viewer
function setupPdfMutationObserver() {
  if (!bionicEnabled || !isPdfViewer) return;
  
  // Create a mutation observer to watch for new text layers as user scrolls through PDF
  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        shouldProcess = true;
      }
    });
    
    if (shouldProcess && bionicEnabled) {
      processPdfTextLayers();
    }
  });
  
  // Target the PDF viewer container
  const viewerContainer = document.querySelector('#viewerContainer') || document.body;
  
  // Start observing
  observer.observe(viewerContainer, {
    childList: true,
    subtree: true
  });
  
  // Store the observer to disconnect it later if needed
  window.bionicPdfObserver = observer;
}

// Function to handle PDF viewer initialization
function initPdfHandler() {
  // Check if we're in a PDF viewer
  if (detectPdfViewer()) {
    console.log('PDF viewer detected');
    
    // Wait for the PDF to fully load
    const checkPdfLoaded = setInterval(() => {
      const pdfLoaded = document.querySelector('.textLayer') !== null;
      
      if (pdfLoaded) {
        clearInterval(checkPdfLoaded);
        console.log('PDF loaded, ready for bionic text conversion');
        
        // Add custom styles for PDF bionic text
        const style = document.createElement('style');
        style.textContent = `
          .textLayer .bionic-processed strong {
            font-weight: bold;
            color: inherit;
          }
        `;
        document.head.appendChild(style);
      }
    }, 1000);
  }
}

// Initialize PDF handler when the page loads
window.addEventListener('load', initPdfHandler);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleBionicText') {
    toggleBionicText();
    sendResponse({ status: 'success', bionicEnabled });
  }
});

// Handle dynamic PDF loading
document.addEventListener('DOMContentLoaded', () => {
  // Initial check for PDF viewer
  detectPdfViewer();
  
  // If it's a PDF, set up the handler
  if (isPdfViewer) {
    initPdfHandler();
  }
});