chrome.storage.sync.get(['mappings'], function(result) {
  const mappings = result.mappings || [];
  
  document.addEventListener('keydown', function(e) {
    mappings.forEach(mapping => {
      const shortcutParts = mapping.shortcut.toLowerCase().split('+');
      const isCtrl = shortcutParts.includes('ctrl') && e.ctrlKey;
      const isAlt = shortcutParts.includes('alt') && e.altKey;
      const isShift = shortcutParts.includes('shift') && e.shiftKey;
      const key = shortcutParts[shortcutParts.length - 1];
      
      if (window.location.href.match(mapping.urlPattern.replace('*', '.*'))) {
        if (isCtrl && isAlt && isShift && e.key.toLowerCase() === key ||
            isCtrl && isAlt && !isShift && e.key.toLowerCase() === key ||
            isCtrl && !isAlt && !isShift && e.key.toLowerCase() === key) {
          e.preventDefault();
          const activeElement = document.activeElement;
          if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.substring(0, start) + 
                                mapping.content + 
                                activeElement.value.substring(end);
          }
        }
      }
    });
  });
});