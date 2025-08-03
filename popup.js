// Popup script for Auto Tab Grouper
document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const groupAllBtn = document.getElementById('groupAllBtn');
  const optionsBtn = document.getElementById('optionsBtn');
  const status = document.getElementById('status');
  
  // Load current status
  loadStatus();
  
  // Toggle switch event
  toggleSwitch.addEventListener('click', function() {
    const isActive = toggleSwitch.classList.contains('active');
    const newState = !isActive;
    
    toggleSwitch.classList.toggle('active');
    updateStatus(newState);
    
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'toggleEnabled',
      enabled: newState
    });
  });
  
  // Group all tabs button
  groupAllBtn.addEventListener('click', function() {
    chrome.runtime.sendMessage({
      action: 'groupAllTabs'
    }, function(response) {
      if (response && response.success) {
        showNotification('Tabs grouped successfully!');
      }
    });
  });
  
  // Open options button
  optionsBtn.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
  
  // Load current status from storage
  async function loadStatus() {
    try {
      const result = await chrome.storage.sync.get(['isEnabled']);
      const isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
      
      if (isEnabled) {
        toggleSwitch.classList.add('active');
        status.textContent = 'Auto grouping is enabled';
      } else {
        toggleSwitch.classList.remove('active');
        status.textContent = 'Auto grouping is disabled';
      }
    } catch (error) {
      console.error('Error loading status:', error);
    }
  }
  
  // Update status display
  function updateStatus(isEnabled) {
    if (isEnabled) {
      status.textContent = 'Auto grouping is enabled';
    } else {
      status.textContent = 'Auto grouping is disabled';
    }
  }
  
  // Show notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style); 