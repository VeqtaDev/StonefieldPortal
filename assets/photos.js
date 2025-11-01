/* Charge images/photos/manifest.json et affiche la galerie avec lightbox */
(async function(){
  const grid = document.getElementById('photos-grid');
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('img');
  const close = lightbox.querySelector('.close');

  let items = [];
  try{
    const res = await fetch('images/photos/manifest.json', {cache:'no-store'});
    const data = await res.json();
    // format: ["photo1.jpg", "event2.png", ...]
    items = Array.isArray(data) ? data : [];
  }catch(err){
    grid.innerHTML = '<p class="muted">Ajoutez un <code>manifest.json</code> dans <code>images/photos/</code> avec une liste de fichiers.</p>';
    return;
  }

  for(const file of items){
    const card = document.createElement('article');
    card.className = 'card';
    const wrap = document.createElement('div');
    wrap.className = 'thumb-wrap';
    const img = document.createElement('img');
    img.className = 'thumb';
    img.alt = 'photo serveur';
    img.loading = 'lazy';
    img.src = `images/photos/${file}`;
    wrap.appendChild(img);
    card.appendChild(wrap);
    card.addEventListener('click', ()=>{
      lbImg.src = img.src;
      lightbox.hidden = false;
    });
    grid.appendChild(card);
  }

  function hide(){ lightbox.hidden = true; lbImg.removeAttribute('src'); }
  close.addEventListener('click', hide);
  lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) hide(); });
  document.addEventListener('keydown', (e)=>{ if(!lightbox.hidden && e.key==='Escape') hide(); });
})();


