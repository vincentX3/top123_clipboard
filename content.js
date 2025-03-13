chrome.storage.sync.get(['mappings'], function(result) {
  const mappings = result.mappings || [];
  
  document.addEventListener('keydown', function(e) {
    mappings.forEach(mapping => {
      // 解析保存的快捷键
      const keys = mapping.shortcut.toLowerCase().split('+');
      
      // 检查当前按键是否匹配快捷键组合
      const matchesShortcut = keys.every(key => {
        switch(key) {
          case 'ctrl': return e.ctrlKey;
          case 'alt': return e.altKey;
          case 'shift': return e.shiftKey;
          case 'cmd': return e.metaKey;
          default: return e.key.toLowerCase() === key;
        }
      });
      
      // 检查URL是否匹配
      const urlMatches = window.location.href.match(
        new RegExp(mapping.urlPattern.replace(/\*/g, '.*'))
      );
      
      if (matchesShortcut && urlMatches) {
        e.preventDefault();
        
        // 获取当前焦点元素
        const activeElement = document.activeElement;
        
        // 处理输入框和文本框
        if (activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.contentEditable === 'true'
        )) {
          // 处理可编辑元素
          if (activeElement.isContentEditable) {
            // 处理富文本编辑器
            document.execCommand('insertText', false, mapping.content);
          } else {
            // 处理普通输入框
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            const value = activeElement.value;
            
            activeElement.value = value.substring(0, start) +
                                mapping.content +
                                value.substring(end);
            
            // 更新光标位置
            activeElement.selectionStart = activeElement.selectionEnd = 
              start + mapping.content.length;
          }
        }
      }
    });
  });
});