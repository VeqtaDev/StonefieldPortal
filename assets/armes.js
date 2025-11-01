/* Charge images/weapons/manifest.json et affiche les armes */
(async function(){
  const grid = document.getElementById('weapons-grid');
  const tpl = document.getElementById('weapon-card-template');
  const search = document.getElementById('w-search');

  let items = [];
  try{
    const res = await fetch('images/weapons/manifest.json', {cache:'no-store'});
    const data = await res.json();
    // format attendu: [{name:"AK-47", spawn:"weapon_ak47", img:"ak47.png"}, ...]
    items = (data||[]).map(w=>({
      name: w.name || w.spawn,
      spawn: w.spawn,
      img: `images/weapons/${w.img}`
    }));
  }catch(err){
    grid.innerHTML = '<p class="muted">Impossible de charger <code>images/weapons/manifest.json</code>.<br>Si vous ouvrez le site directement en fichier (<code>file://</code>), le navigateur bloque <em>fetch</em>. Servez le dossier via un serveur local (ex. <code>python -m http.server 5500</code> puis <code>http://localhost:5500/</code>).<br>Exemple de contenu attendu: <code>[{"name":"AK","spawn":"weapon_ak","img":"ak.png"}]</code></p>';
    return;
  }

  function render(){
    const q = (search.value||'').toLowerCase();
    grid.innerHTML = '';
    const filtered = items.filter(it=> it.name.toLowerCase().includes(q) || it.spawn.toLowerCase().includes(q));
    for(const it of filtered){
      const node = tpl.content.firstElementChild.cloneNode(true);
      const img = node.querySelector('img.thumb');
      img.src = it.img; img.onerror = ()=>{ img.src = 'assets/placeholder-weapon.png'; };
      node.querySelector('.name').textContent = it.name;
      node.querySelector('.spawn').textContent = it.spawn;
      node.querySelector('.copy').addEventListener('click', ()=> SF.copyToClipboard(it.spawn));
      grid.appendChild(node);
    }
  }

  search.addEventListener('input', render);
  render();
})();


