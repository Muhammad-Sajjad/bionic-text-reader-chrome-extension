// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Send a message to the content script
  chrome.tabs.sendMessage(
    tab.id,
    { action: "toggleBionicText" },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      
      // Update the icon based on the state
      if (response && response.bionicEnabled) {
        chrome.action.setIcon({
          path: {
            16: "icons/icon16-active.png",
            48: "icons/icon48-active.png",
            128: "icons/icon128-active.png"
          },
          tabId: tab.id
        });
      } else {
        chrome.action.setIcon({
          path: {
            16: "icons/icon16.png",
            48: "icons/icon48.png",
            128: "icons/icon128.png"
          },
          tabId: tab.id
        });
      }
    }
  );
});