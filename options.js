// Options page script for Auto Tab Grouper
document.addEventListener('DOMContentLoaded', function() {
  const rulesContainer = document.getElementById('rulesContainer');
  const addRuleBtn = document.getElementById('addRuleBtn');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  
  let rules = [];
  
  // Load existing rules
  loadRules();
  
  // Add rule button
  addRuleBtn.addEventListener('click', function() {
    addNewRule();
  });
  
  // Save button
  saveBtn.addEventListener('click', function() {
    saveRules();
  });
  
  // Load rules from storage
  async function loadRules() {
    try {
      const result = await chrome.storage.sync.get(['rules']);
      rules = result.rules || getDefaultRules();
      renderRules();
    } catch (error) {
      console.error('Error loading rules:', error);
      showStatus('Error loading rules', 'error');
    }
  }
  
  // Get default rules
  function getDefaultRules() {
    return [
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
    ];
  }
  
  // Render rules in the UI
  function renderRules() {
    rulesContainer.innerHTML = '';
    
    rules.forEach((rule, index) => {
      const ruleElement = createRuleElement(rule, index);
      rulesContainer.appendChild(ruleElement);
    });
  }
  
  // Create a rule element
  function createRuleElement(rule, index) {
    const ruleDiv = document.createElement('div');
    ruleDiv.className = 'rule';
    
    const header = document.createElement('div');
    header.className = 'rule-header';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = rule.name;
    nameInput.placeholder = 'Rule name';
    nameInput.addEventListener('input', function() {
      rules[index].name = this.value;
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function() {
      rules.splice(index, 1);
      renderRules();
    });
    
    header.appendChild(nameInput);
    header.appendChild(deleteBtn);
    ruleDiv.appendChild(header);
    
    // Patterns
    rule.patterns.forEach((pattern, patternIndex) => {
      const patternDiv = document.createElement('div');
      patternDiv.className = 'pattern';
      
      const patternInput = document.createElement('input');
      patternInput.type = 'text';
      patternInput.value = pattern;
      patternInput.placeholder = 'URL pattern (regex)';
      patternInput.addEventListener('input', function() {
        rules[index].patterns[patternIndex] = this.value;
      });
      
      const removePatternBtn = document.createElement('button');
      removePatternBtn.textContent = 'Remove';
      removePatternBtn.style.cssText = 'margin-left: 10px; padding: 5px 10px; background: #ff9800; color: white; border: none; border-radius: 3px; cursor: pointer;';
      removePatternBtn.addEventListener('click', function() {
        rules[index].patterns.splice(patternIndex, 1);
        renderRules();
      });
      
      patternDiv.appendChild(patternInput);
      patternDiv.appendChild(removePatternBtn);
      ruleDiv.appendChild(patternDiv);
    });
    
    // Add pattern button
    const addPatternBtn = document.createElement('button');
    addPatternBtn.textContent = 'Add Pattern';
    addPatternBtn.style.cssText = 'margin-top: 10px; padding: 5px 10px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;';
    addPatternBtn.addEventListener('click', function() {
      rules[index].patterns.push('');
      renderRules();
    });
    
    ruleDiv.appendChild(addPatternBtn);
    
    return ruleDiv;
  }
  
  // Add new rule
  function addNewRule() {
    rules.push({
      name: 'New Rule',
      patterns: ['']
    });
    renderRules();
  }
  
  // Save rules to storage
  async function saveRules() {
    try {
      // Validate rules
      const validRules = rules.filter(rule => 
        rule.name && rule.name.trim() && 
        rule.patterns && rule.patterns.length > 0 &&
        rule.patterns.some(pattern => pattern && pattern.trim())
      );
      
      await chrome.storage.sync.set({ rules: validRules });
      showStatus('Settings saved successfully!', 'success');
      
      // Update background script
      chrome.runtime.sendMessage({
        action: 'updateRules',
        rules: validRules
      });
      
    } catch (error) {
      console.error('Error saving rules:', error);
      showStatus('Error saving settings', 'error');
    }
  }
  
  // Show status message
  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }
}); 