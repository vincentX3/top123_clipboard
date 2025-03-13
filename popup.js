document.addEventListener('DOMContentLoaded', function() {
  loadMappings();
  
  const shortcutInput = document.getElementById('shortcut');
  const clearShortcutBtn = document.getElementById('clearShortcut');
  let keys = new Set();
  let isInputting = false;
  
  // 快捷键输入处理
  shortcutInput.addEventListener('keydown', function(e) {
    e.preventDefault();
    isInputting = true;
    
    // 记录按下的键
    if (e.key === 'Control') keys.add('ctrl');
    else if (e.key === 'Alt') keys.add('alt');
    else if (e.key === 'Shift') keys.add('shift');
    else if (e.key === 'Meta') keys.add('cmd');
    else if (e.key.length === 1) {
      keys.add(e.key.toLowerCase());
      // 完成输入
      setTimeout(() => {
        isInputting = false;
      }, 100);
    }
    
    updateShortcutDisplay();
  });
  
  shortcutInput.addEventListener('keyup', function(e) {
    if (!isInputting) return;
    
    // 只移除功能键
    if (e.key === 'Control') keys.delete('ctrl');
    else if (e.key === 'Alt') keys.delete('alt');
    else if (e.key === 'Shift') keys.delete('shift');
    else if (e.key === 'Meta') keys.delete('cmd');
    
    updateShortcutDisplay();
  });
  
  // 防止失焦时清空
  // 修改 blur 事件处理
  shortcutInput.addEventListener('blur', function(e) {
    // 移除阻止失焦的逻辑，允许切换到其他输入框
    isInputting = false;
  });
  
  function updateShortcutDisplay() {
    const keyArray = Array.from(keys);
    if (keyArray.length > 0) {
      shortcutInput.value = keyArray.join('+');
    }
  }
  
  // 清除快捷键按钮
  clearShortcutBtn.addEventListener('click', function() {
    keys.clear();
    shortcutInput.value = '';
  });
  
  function updateShortcutDisplay() {
    const keyArray = Array.from(keys);
    shortcutInput.value = keyArray.join('+');
  }
  
  // 自动填充默认快捷键
  const platform = navigator.platform.toLowerCase();
  const defaultShortcut = platform.includes('mac') ? 'cmd+1' : 'ctrl+1';
  document.getElementById('shortcut').value = defaultShortcut;
  
  // 获取当前标签页URL并填充
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentUrl = tabs[0].url;
    const urlPattern = currentUrl.replace(/^https?:\/\//, '*://').replace(/\/[^/]*$/, '/*');
    document.getElementById('urlPattern').value = urlPattern;
  });
  
  document.getElementById('save').addEventListener('click', function() {
    const urlPattern = document.getElementById('urlPattern').value;
    const shortcut = document.getElementById('shortcut').value;
    const content = document.getElementById('content').value;
    
    if (!urlPattern || !shortcut || !content) {
      alert('请填写所有字段！');
      return;
    }
    
    chrome.storage.sync.get(['mappings'], function(result) {
      const mappings = result.mappings || [];
      mappings.push({ urlPattern, shortcut, content });
      
      chrome.storage.sync.set({ mappings }, function() {
        loadMappings();
        clearForm();
      });
    });
  });
});

function loadMappings() {
  const listDiv = document.getElementById('mappingList');
  chrome.storage.sync.get(['mappings'], function(result) {
    const mappings = result.mappings || [];
    listDiv.innerHTML = mappings.map((mapping, index) => `
      <div class="mapping-item">
        <div>URL: ${mapping.urlPattern}</div>
        <div>快捷键: ${mapping.shortcut}</div>
        <div>内容: ${mapping.content.substring(0, 50)}...</div>
        <span class="delete-btn" data-index="${index}">删除</span>
      </div>
    `).join('');
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        mappings.splice(index, 1);
        chrome.storage.sync.set({ mappings }, loadMappings);
      });
    });
  });
}

function clearForm() {
  document.getElementById('urlPattern').value = '';
  document.getElementById('shortcut').value = '';
  document.getElementById('content').value = '';
}