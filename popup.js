document.addEventListener('DOMContentLoaded', function() {
  loadMappings();
  
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