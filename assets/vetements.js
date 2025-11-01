/* Charge images/clothes/manifest.json et affiche les vêtements */
(async function(){
  const grid = document.getElementById('clothes-grid');
  const tpl = document.getElementById('clothes-card-template');
  const search = document.getElementById('c-search');

  let items = [];
  try{
    const res = await fetch('images/clothes/manifest.json', {cache:'no-store'});
    const data = await res.json();
    items = (data||[]).map(entry=>{
      if(typeof entry === 'string'){
        const base = entry.replace(/\.[^.]+$/, '');
        return { name: base.replace(/[_-]+/g,' '), code: base, img: entry };
      }
      // Ajoute regroupements si infos présentes (gender/component)
      const name = entry.name || entry.code || entry.img;
      return { name, code: entry.code || name, img: entry.img, gender: entry.gender, component: entry.component, drawable: entry.drawable };
    });
  }catch(err){
    grid.innerHTML = '<p class="muted">Impossible de charger <code>images/clothes/manifest.json</code>. Générez-le avec <code>assets/generate_clothes_manifest.ps1</code> puis rechargez.</p>';
    return;
  }

  // Rendu progressif pour éviter les freezes: on ajoute par petits lots
  function render(){
    const q = (search.value||'').toLowerCase();
    grid.innerHTML = '';
    const filtered = items.filter(it=> (it.name||'').toLowerCase().includes(q) || (it.code||'').toLowerCase().includes(q));

    const BATCH_SIZE = 32; // nombre de cartes par lot
    let index = 0;

    const appendBatch = () => {
      const end = Math.min(index + BATCH_SIZE, filtered.length);
      for(let i=index;i<end;i++){
        const it = filtered[i];
        const node = tpl.content.firstElementChild.cloneNode(true);
        const img = node.querySelector('img.thumb');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = `images/clothes/${it.img}`;
        img.onerror = ()=>{ img.src = 'assets/placeholder-weapon.png'; };
        node.querySelector('.name').textContent = it.name || it.code;
        node.querySelector('.code').textContent = it.code || '';
        node.querySelector('.copy').addEventListener('click', ()=> SF.copyToClipboard(it.code || it.name));
        grid.appendChild(node);
      }
      index = end;
      if(index < filtered.length){
        // Planifie le lot suivant quand le thread est libre
        const schedule = window.requestIdleCallback || ((cb)=> setTimeout(cb, 16));
        schedule(appendBatch);
      }
    };

    appendBatch();
  }

  search.addEventListener('input', render);
  render();
})();


