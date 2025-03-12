chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(['mappings'], function(result) {
    if (!result.mappings) {
      // 检测操作系统并设置默认快捷键
      const platform = navigator.platform.toLowerCase();
      const defaultShortcut = platform.includes('mac') ? 'cmd+1' : 'ctrl+1';
      
      // 设置默认配置
      const defaultMappings = [{
        urlPattern: '*://*/*',
        shortcut: defaultShortcut,
        content: '这是默认文本，您可以在设置中修改'
      }];
      
      chrome.storage.sync.set({ mappings: defaultMappings });
    }
  });
});