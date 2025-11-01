/* Suivi Staff: liste + modal détail, notes en localStorage, compteur reports mock */
(async function(){
  const grid = document.getElementById('staff-grid');
  const tpl = document.getElementById('staff-card-template');
  const search = document.getElementById('s-search');

  // panneaux inline (pas de modals)
  const createPanel = document.getElementById('create-panel');
  const cName = document.getElementById('c-name');
  const cRole = document.getElementById('c-role');
  const cAvatar = document.getElementById('c-avatar');
  const cSave = document.getElementById('c-save');
  const cCancel = document.getElementById('c-cancel');

  const detailPanel = document.getElementById('detail-panel');
  const dAvatar = document.getElementById('d-avatar');
  const dName = document.getElementById('d-name');
  const dRole = document.getElementById('d-role');
  const dReports = document.getElementById('d-reports');
  const dNotes = document.getElementById('d-notes');
  const dSave = document.getElementById('d-save');
  const dClose = document.getElementById('d-close');
  const dDelete = document.getElementById('d-delete');
  let currentStaffId = null;

  // palette de rôles demandée
  const ROLE_COLORS = {
    'helpeur': '#2ecc71',          // vert
    'moderateur': '#3fa7ff',       // bleu
    'administrateur': '#1f4b99',   // bleu foncé
    'super admin': '#9b59b6',      // violet
    'responsable': '#f1c40f',      // jaune
    'gerant': '#f39c12',           // orange
    'fondateur': '#e74c3c'         // rouge
  };

  function roleBadge(role){
    const color = ROLE_COLORS[(role||'').toLowerCase()] || '#ffdeb3';
    return `<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${color};color:#111;font-weight:700">${role}</span>`;
  }

  let staff = [];
  try{
    const res = await fetch('assets/staff.json', {cache:'no-store'});
    if(res.ok){ staff = await res.json(); }
  }catch(err){ /* pas de seed par défaut */ }

  function getCustom(){
    try{ return JSON.parse(localStorage.getItem('sf_staff_custom')||'[]'); }catch{ return []; }
  }
  function saveCustom(list){ localStorage.setItem('sf_staff_custom', JSON.stringify(list||[])); }

  function storageKey(id){ return `sf_staff_notes_${id}`; }

  function render(){
    const q = (search.value||'').toLowerCase();
    grid.innerHTML = '';
    const merged = [...staff, ...getCustom()];
    const filtered = merged.filter(s=> s.name.toLowerCase().includes(q) || (s.role||'').toLowerCase().includes(q));

    document.getElementById('staff-empty').style.display = filtered.length ? 'none' : 'block';

    for(const s of filtered){
      const node = tpl.content.firstElementChild.cloneNode(true);
      const img = node.querySelector('img.thumb');
      img.src = s.avatar || 'assets/logo.png';
      img.onerror = ()=>{ img.src = 'assets/logo.png'; };
      node.querySelector('.name').textContent = s.name;
      const badge = node.querySelector('.badge');
      badge.innerHTML = s.role ? s.role : '';
      badge.style.cssText = `position:absolute;left:8px;top:8px;padding:2px 8px;border-radius:999px;background:${ROLE_COLORS[(s.role||'').toLowerCase()]||'rgba(243,180,110,.4)'};color:#111;font-weight:700`;
      node.querySelector('.reports').textContent = `Reports: ${s.reports ?? 0}`;

      node.addEventListener('click', ()=> openDetail(s));
      grid.appendChild(node);
    }
  }

  function openDetail(s){
    if(!detailPanel) return;
    currentStaffId = s.id;
    dAvatar.src = s.avatar || 'assets/logo.png';
    dName.textContent = s.name;
    dRole.innerHTML = s.role ? roleBadge(s.role) : '';
    dReports.textContent = `Reports: ${s.reports ?? 0}`;
    dNotes.value = localStorage.getItem(storageKey(s.id)) || '';
    dSave.onclick = ()=>{
      localStorage.setItem(storageKey(s.id), dNotes.value);
      SF.toast('Notes enregistrées');
    };
    dClose.onclick = ()=>{ detailPanel.style.display = 'none'; };
    if(dDelete){
      dDelete.onclick = ()=>{
        const pwd = prompt('Mot de passe requis pour supprimer:');
        if(pwd !== 'Stoneclub'){ SF.toast('Mot de passe invalide'); return; }
        const custom = getCustom();
        const after = custom.filter(x=> x.id !== currentStaffId);
        if(after.length === custom.length){
          SF.toast('Élément non supprimable (source système)');
          return;
        }
        saveCustom(after);
        detailPanel.style.display = 'none';
        SF.toast('Membre supprimé');
        render();
      };
    }
    detailPanel.style.display = 'block';
    detailPanel.scrollIntoView({behavior:'smooth', block:'nearest'});
  }

  // Création via panneau inline
  const addBtn = document.getElementById('add-staff');
  if(addBtn && createPanel && cName && cRole && cAvatar && cSave && cCancel){
    createPanel.style.display = 'none';
    detailPanel && (detailPanel.style.display = 'none');
    addBtn.addEventListener('click', ()=>{
      const open = createPanel.style.display !== 'none';
      if(open){ createPanel.style.display = 'none'; return; }
      cName.value = '';
      cRole.value = 'Helpeur';
      cAvatar.value = '';
      createPanel.style.display = 'block';
      createPanel.scrollIntoView({behavior:'smooth', block:'nearest'});
    });
    cCancel.addEventListener('click', (e)=>{ e.preventDefault(); createPanel.style.display = 'none'; });
    cSave.addEventListener('click', (e)=>{
      e.preventDefault();
      const pwd = prompt('Mot de passe requis pour créer un membre:');
      if(pwd !== 'Stoneclub'){ SF.toast('Mot de passe invalide'); return; }
      const name = cName.value.trim(); if(!name){ SF.toast('Nom requis'); return; }
      const role = cRole.value;
      const avatar = cAvatar.value.trim() || 'assets/logo.png';
      const custom = getCustom();
      const id = 'c_' + Date.now();
      custom.push({ id, name, role, avatar, reports: 0 });
      saveCustom(custom);
      createPanel.style.display = 'none';
      SF.toast('Membre créé');
      render();
    });
  }

  search.addEventListener('input', render);
  render();
})();


