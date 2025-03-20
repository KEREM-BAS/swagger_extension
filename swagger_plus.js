function addCopyButton(element, buttonClass, getTextCallback) {
    if (element.querySelector('.' + buttonClass)) return;
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.className = buttonClass;
    btn.style.position = 'absolute';
    btn.style.right = '5px';
    btn.style.top = '50%';
    btn.style.transform = 'translateY(-50%)';
    btn.style.padding = '4px 8px';
    btn.style.fontSize = '0.8em';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '3px';
    btn.style.backgroundColor = '#f0f0f0';
    btn.style.cursor = 'pointer';
    
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const textToCopy = getTextCallback(element);
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = originalText; }, 2000);
      }).catch(err => {
        console.error('Copy failed: ', err);
        btn.textContent = 'Error';
      });
    });
    
    element.appendChild(btn);
  }
  
  function injectUrlCopyButtons() {
    const endpointsV3 = document.querySelectorAll('.opblock-summary-path');
    endpointsV3.forEach(endpoint => {
      addCopyButton(endpoint, 'copy-url-btn', (el) => {
        const a = el.querySelector('a');
        return (a && a.href) ? a.href.trim() : el.textContent.trim();
      });
    });
    
    const endpointsV2 = document.querySelectorAll('.request_url');
    endpointsV2.forEach(endpoint => {
      addCopyButton(endpoint, 'copy-url-btn', (el) => {
        return el.textContent.trim();
      });
    });
  }
  
  function injectResponseCopyButtons() {
    const responseModels = document.querySelectorAll('.response_model');
    responseModels.forEach(model => {
      addCopyButton(model, 'copy-response-btn', (el) => {
        return el.textContent.trim();
      });
    });
    
    const preModels = document.querySelectorAll('pre');
    preModels.forEach(pre => {
      const text = pre.textContent.trim();
      if ((text.startsWith('{') || text.startsWith('[')) && text.length > 0) {
        if (!pre.closest('.response_model')) {
          addCopyButton(pre, 'copy-response-btn', (el) => {
            return el.textContent.trim();
          });
        }
      }
    });
  }
  
  window.addEventListener('load', () => {
    injectUrlCopyButtons();
    injectResponseCopyButtons();
    const observer = new MutationObserver(() => {
      injectUrlCopyButtons();
      injectResponseCopyButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
  