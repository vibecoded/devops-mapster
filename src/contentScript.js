
// This script runs in the context of web pages that match
// the patterns specified in the manifest

// Simple detection for various CI/CD platforms
function detectPipeline() {
  const url = window.location.href;
  let pipelineDetected = false;
  
  // GitHub Actions detection
  if (url.includes('github.com') && (
      url.includes('/actions') || 
      url.includes('/workflows') ||
      document.querySelector('.workflow-nav')
  )) {
    pipelineDetected = true;
  }
  
  // GitLab CI detection
  if (url.includes('gitlab.com') && (
      url.includes('/pipelines') ||
      url.includes('/-/ci/') ||
      document.querySelector('.ci-table')
  )) {
    pipelineDetected = true;
  }
  
  // Jenkins detection
  if ((url.includes('jenkins') || url.includes('/job/')) && (
      document.querySelector('.pipeline-stage-view') ||
      document.querySelector('.pipeline-node')
  )) {
    pipelineDetected = true;
  }
  
  // Azure DevOps detection
  if (url.includes('azure.com') && (
      url.includes('/_build') ||
      url.includes('/_release') ||
      document.querySelector('.pipeline-list')
  )) {
    pipelineDetected = true;
  }
  
  // CircleCI detection
  if (url.includes('circleci.com') && (
      url.includes('/pipelines/') ||
      document.querySelector('.pipeline-card')
  )) {
    pipelineDetected = true;
  }
  
  return pipelineDetected;
}

// Main initialization
function init() {
  // Check if the current page contains a pipeline
  if (detectPipeline()) {
    // Notify the background script that we found a pipeline
    browser.runtime.sendMessage({
      type: 'PIPELINE_DETECTED',
      url: window.location.href
    });
    
    // Add button to open visualizer
    const button = document.createElement('button');
    button.textContent = 'Open Pipeline Visualizer';
    button.className = 'pipeline-visualizer-btn';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '8px 16px';
    button.style.backgroundColor = '#3b82f6';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', () => {
      browser.runtime.sendMessage({ type: 'OPEN_VISUALIZER' });
    });
    
    document.body.appendChild(button);
  }
}

// Run the initialization when the page is fully loaded
window.addEventListener('load', init);

// Also check when URL changes (SPA detection)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(init, 1000); // Wait a bit for SPA to render
  }
}).observe(document, { subtree: true, childList: true });
