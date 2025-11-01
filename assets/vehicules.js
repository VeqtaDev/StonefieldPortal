/* Charge assets/vehicules.txt avec support des catégories et génère la grille */
(async function(){
  const grid = document.getElementById('grid');
  const search = document.getElementById('search');
  const filterType = document.getElementById('filter-type');
  const filterCategory = document.getElementById('filter-category');
  const tpl = document.getElementById('card-template');

  const listUrl = 'assets/vehicules.txt';

  let items = [];
  let categories = new Set(['Tous']);
  
  try{
    const res = await fetch(listUrl);
    const text = await res.text();
    const lines = text.split(/\r?\n/).map(l=>l.trim());
    
    let currentCategory = 'Autres';
    
    for(const line of lines){
      if(!line) continue;
      
      // Détection des catégories (lignes commençant par --)
      if(line.startsWith('--')){
        currentCategory = line.replace(/^--\s*/, '').trim() || 'Autres';
        if(currentCategory && currentCategory !== 'Autres'){
          categories.add(currentCategory);
        }
        continue;
      }
      
      // Ligne de véhicule
      items.push({
        name: line,
        spawn: line,
        category: currentCategory || 'Autres',
        // règle simple pour tagger custom vs gta: majuscules = vanilla-like?
        type: /[A-Z]{3,}/.test(line) ? 'gta' : 'custom',
        img: `images/vehicules/${line}.png`,
      });
    }
    
    // Remplir le filtre de catégories
    if(filterCategory){
      const sortedCategories = Array.from(categories).sort();
      filterCategory.innerHTML = '<option value="all">Toutes les catégories</option>';
      sortedCategories.forEach(cat => {
        if(cat !== 'Tous'){
          const option = document.createElement('option');
          option.value = cat;
          option.textContent = cat;
          filterCategory.appendChild(option);
        }
      });
    }
    
  }catch(err){
    console.error('Impossible de charger la liste des véhicules', err);
    grid.innerHTML = '<p class="muted">Impossible de charger la liste. Vérifiez <code>assets/vehicules.txt</code>.</p>';
    return;
  }

  function render(){
    const q = (search.value||'').toLowerCase();
    const type = filterType ? filterType.value : 'all';
    const category = filterCategory ? filterCategory.value : 'all';
    
    grid.innerHTML = '';
    
    const filtered = items.filter(it=>{
      const matchQ = it.name.toLowerCase().includes(q);
      const matchT = type==='all' ? true : it.type===type;
      const matchC = category==='all' ? true : it.category===category;
      return matchQ && matchT && matchC;
    });
    
    // Tri par catégorie puis par nom
    filtered.sort((a, b) => {
      if(a.category !== b.category){
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
    
    for(const it of filtered){
      const node = tpl.content.firstElementChild.cloneNode(true);
      const img = node.querySelector('img.thumb');
      img.src = it.img;
      img.onerror = ()=>{ img.src = 'assets/placeholder-vehicule.png'; };
      node.querySelector('.name').textContent = it.name;
      node.querySelector('.spawn').textContent = it.spawn;
      node.querySelector('.copy').addEventListener('click', ()=> SF.copyToClipboard(it.spawn));
      grid.appendChild(node);
    }
    
    // Afficher le nombre de résultats
    const count = filtered.length;
    const countEl = document.getElementById('results-count');
    if(countEl){
      countEl.textContent = `${count} véhicule${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
    }
  }

  search.addEventListener('input', render);
  if(filterType) filterType.addEventListener('change', render);
  if(filterCategory) filterCategory.addEventListener('change', render);
  render();
})();


