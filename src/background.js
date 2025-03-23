
// This background script manages the extension's lifecycle and communicates
// with content scripts injected into pages

// Initialize extension when installed
browser.runtime.onInstalled.addListener(() => {
  console.log('DevOps Pipeline Visualizer extension has been installed');
  
  // Initialize storage with default settings
  browser.storage.local.set({
    enabledPlatforms: {
      github: true,
      gitlab: true,
      jenkins: true,
      azure: true,
      circleci: true
    },
    analysisDefaults: {
      criticalPath: false,
      bottlenecks: false,
      resources: false
    },
    theme: 'light'
  });
});

// Listen for messages from content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PIPELINE_DETECTED') {
    // A pipeline was detected on the page
    console.log('Pipeline detected on:', sender.tab.url);
    
    // Notify the user that we found a pipeline
    browser.browserAction.setBadgeText({
      text: '!',
      tabId: sender.tab.id
    });
    
    browser.browserAction.setBadgeBackgroundColor({
      color: '#3b82f6',
      tabId: sender.tab.id
    });
    
    sendResponse({ success: true });
  }
  return true;
});
