// Background service worker for Auto Tab Grouper
let isEnabled = true;

// Check if a URL is a special page that shouldn't be grouped
function isSpecialPage(url) {
  if (!url) return true;
  
  const specialPages = [
    'chrome://newtab/',
    'chrome://new-tab-page/',
    'chrome://startup/',
    'chrome://welcome/',
    'chrome://extensions/',
    'chrome://settings/',
    'chrome://history/',
    'chrome://bookmarks/',
    'chrome://downloads/',
    'about:newtab',
    'about:blank',
    'about:home'
  ];
  
  return specialPages.some(specialPage => url.startsWith(specialPage));
}

// Collapse all groups except the specified one
async function collapseOtherGroups(activeGroupId) {
  try {
    const allGroups = await chrome.tabGroups.query({});
    
    for (const group of allGroups) {
      if (group.id !== activeGroupId && !group.collapsed) {
        await chrome.tabGroups.update(group.id, { collapsed: true });
      }
    }
  } catch (error) {
    console.error('Error collapsing other groups:', error);
  }
}

// Focus on a specific tab, even if it's in another window
async function focusTab(tabId) {
  try {
    // Get the tab to find its window
    const tab = await chrome.tabs.get(tabId);
    
    // Activate the window containing the tab
    await chrome.windows.update(tab.windowId, { focused: true });
    
    // Activate the tab
    await chrome.tabs.update(tabId, { active: true });
    
  } catch (error) {
    console.error('Error focusing tab:', error);
  }
}

// Update group title with tab count
async function updateGroupTitle(groupId, baseTitle) {
  try {
    // Get all tabs in this group
    const tabs = await chrome.tabs.query({ groupId: groupId });
    const tabCount = tabs.length;
    
    // Create title with count
    const titleWithCount = `${baseTitle} (${tabCount})`;
    
    // Update the group title
    await chrome.tabGroups.update(groupId, { title: titleWithCount });
    
  } catch (error) {
    console.error('Error updating group title:', error);
  }
}



// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  // Set default configuration
  chrome.storage.sync.set({
    isEnabled: true,
    rules: [
      {
        name: "Social Media",
        patterns: [
          ".*facebook\\.com.*",
          ".*twitter\\.com.*",
          ".*instagram\\.com.*",
          ".*linkedin\\.com.*"
        ]
      },
      {
        name: "Development",
        patterns: [
          ".*github\\.com.*",
          ".*stackoverflow\\.com.*",
          ".*developer\\.mozilla\\.org.*"
        ]
      },
      {
        name: "News",
        patterns: [
          ".*news\\..*",
          ".*bbc\\.com.*",
          ".*cnn\\.com.*"
        ]
      }
    ]
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isEnabled && tab.url && !isSpecialPage(tab.url)) {
    groupTab(tab);
  }
});

// Listen for tab creation
chrome.tabs.onCreated.addListener((tab) => {
  if (isEnabled && tab.url && !isSpecialPage(tab.url)) {
    setTimeout(() => groupTab(tab), 1000); // Small delay to ensure tab is fully loaded
  }
});

const tabGroupMap = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    tabGroupMap.set(tabId, tab.groupId);
  }
});
// Listen for group updates (when user manually expands/collapses groups)
chrome.tabGroups.onUpdated.addListener((group) => {
  if (!group.collapsed) {
    // If a group was expanded, collapse other groups
    collapseOtherGroups(group.id);
  }
});

// Listen for tab removal to update group titles
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {

  try {
    const groupId = tabGroupMap.get(tabId);
    if (groupId) {
      const group = await chrome.tabGroups.get(groupId);
      if (group) {
        // Extract base title (remove the count part)
        const baseTitle = group.title.replace(/\s*\(\d+\)$/, '');
        await updateGroupTitle(groupId, baseTitle);
      }
    } 
  } catch (error) {
    console.error('Error updating group title after tab removal:', error);
  }
});

// Main function to group tabs
async function groupTab(tab) {
    const config = await chrome.storage.sync.get(['isEnabled', 'rules']);
    
    if (!config.isEnabled) return;
    
    const groupName = getGroupName(tab.url, config.rules);
    
    if (groupName) {
      try {
          // Check if a group with this name already exists
          const groups = await chrome.tabGroups.query({});
          let existingGroup = groups.find(group => {
            // Extract base title from group title (remove count part)
            const baseTitle = group.title.replace(/\s*\(\d+\)$/, '');
            return baseTitle === groupName;
          });
          
          if (!existingGroup) {
            // Create new group
            const groupId = await chrome.tabs.group({ tabIds: tab.id });
            await updateGroupTitle(groupId, groupName);
            // Collapse other groups
            await collapseOtherGroups(groupId);
            // Focus on the tab
            await focusTab(tab.id);
          } else {
            // Add tab to existing group
            await chrome.tabs.group({
              groupId: existingGroup.id,
              tabIds: tab.id
            });
            await updateGroupTitle(existingGroup.id, groupName);
            // Collapse other groups
            await collapseOtherGroups(existingGroup.id);
            // Focus on the tab
            await focusTab(tab.id);
          }
        }catch (groupError) {
          console.error('Error with tab groups API:', groupError);
          return;
      }
    }
} 
    



// Function to determine group name based on URL and rules
function getGroupName(url, rules) {
  // First check custom rules
  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      try {
        const regex = new RegExp(pattern);
        if (regex.test(url)) {
          return rule.name;
        }
      } catch (error) {
        console.error('Invalid regex pattern:', pattern, error);
      }
    }
  }
  
  // If no custom rule matches, use domain name
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  } catch (error) {
    console.error('Error extracting domain:', error);
    return null;
  }
}

// Listen for messages from popup and options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleEnabled') {
    isEnabled = request.enabled;
    sendResponse({ success: true });
  } else if (request.action === 'getStatus') {
    sendResponse({ isEnabled });
  } else if (request.action === 'groupAllTabs') {
    groupAllTabs();
    sendResponse({ success: true });
  } else if (request.action === 'updateRules') {
    // Rules will be automatically updated from storage
    sendResponse({ success: true });
  }
});

// Function to group all existing tabs
async function groupAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    const config = await chrome.storage.sync.get(['rules']);
    
    for (const tab of tabs) {
      if (tab.url && tab.url.startsWith('http') && !isSpecialPage(tab.url)) {
        try {
          await groupTab(tab);
        } catch (tabError) {
          console.error(`Error grouping tab ${tab.id}:`, tabError);
          // Continue with other tabs even if one fails
        }
      }
    }
  } catch (error) {
    console.error('Error grouping all tabs:', error);
  }
} 