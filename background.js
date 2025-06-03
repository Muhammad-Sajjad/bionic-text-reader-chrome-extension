// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Check if the current tab is a PDF
  const isPdf = tab.url.toLowerCase().endsWith('.pdf') || tab.url.includes('pdf');
  
  // Send a message to the content script
  chrome.tabs.sendMessage(
    tab.id,
    { action: "toggleBionicText", isPdf: isPdf },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        
        // If there's an error, it might be because the content script hasn't been injected yet
        // This can happen with PDFs that are loaded directly
        if (isPdf) {
          // Inject the content script manually for PDFs
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }).then(() => {
            // After injection, try sending the message again
            setTimeout(() => {
              chrome.tabs.sendMessage(
                tab.id,
                { action: "toggleBionicText", isPdf: true },
                (innerResponse) => {
                  updateIcon(tab.id, innerResponse && innerResponse.bionicEnabled);
                }
              );
            }, 500);
          }).catch(err => console.error('Script injection error:', err));
        }
        return;
      }
      
      updateIcon(tab.id, response && response.bionicEnabled);
    }
  );
});

// Function to update the extension icon based on state
function updateIcon(tabId, bionicEnabled) {
  if (bionicEnabled) {
    chrome.action.setIcon({
      path: {
        16: "icons/icon16-active.svg",
        48: "icons/icon48-active.svg",
        128: "icons/icon128-active.svg"
      },
      tabId: tabId
    });
  } else {
    chrome.action.setIcon({
      path: {
        16: "icons/icon16.svg",
        48: "icons/icon48.svg",
        128: "icons/icon128.svg"
      },
      tabId: tabId
    });
  }
}