window.SF = {
  initTheme() {
    // Accents subtils via ombres
    document.querySelectorAll('.card').forEach(el=>{
      el.style.boxShadow = '0 6px 20px rgba(0,0,0,.35)';
    });
  },
  copyToClipboard(text){
    navigator.clipboard.writeText(text).then(()=>{
      SF.toast('Copié: ' + text);
    }).catch(()=>{
      // Fallback discret
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      SF.toast('Copié: ' + text);
    });
  },
  toast(msg){
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.8);color:#fff;padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.1);z-index:9999;';
    document.body.appendChild(t);
    setTimeout(()=>t.remove(), 1800);
  }
};


