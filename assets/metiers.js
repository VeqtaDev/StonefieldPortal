/* Affiche les métiers (jobs) avec grades et commande setjob */
(async function(){
  const grid = document.getElementById('jobs-grid');
  const tpl = document.getElementById('job-card-template');
  const search = document.getElementById('m-search');

  let jobs = [];
  try{
    const res = await fetch('assets/metiers.json', {cache:'no-store'});
    jobs = await res.json();
  }catch(err){
    grid.innerHTML = '<p class="muted">Impossible de charger <code>assets/metiers.json</code>. Servez le site via http://localhost:5500/</p>';
    return;
  }

  function render(){
    const q = (search.value||'').toLowerCase();
    grid.innerHTML = '';
    const filtered = jobs.filter(j=> j.label.toLowerCase().includes(q) || j.name.toLowerCase().includes(q));
    for(const job of filtered){
      const node = tpl.content.firstElementChild.cloneNode(true);
      const img = node.querySelector('img.thumb');
      // Utiliser le logo générique pour toutes les entreprises
      img.src = 'images/metiers/joblogo.png';
      node.querySelector('.name').textContent = job.label || job.name;
      const exampleSet = `/setjob <id> ${job.name} <grade>`;
      node.querySelector('.spawn').textContent = exampleSet;
      node.querySelector('.copy').addEventListener('click', ()=> SF.copyToClipboard(exampleSet));

      const gradesDiv = node.querySelector('.grades');
      if (Array.isArray(job.grades) && job.grades.length){
        gradesDiv.innerHTML = job.grades
          .sort((a,b)=> a.grade - b.grade)
          .map(g=> `${g.grade}: ${g.label || g.name}`)
          .join(' · ');
      } else {
        gradesDiv.textContent = 'Aucun grade défini';
      }
      grid.appendChild(node);
    }
  }

  search.addEventListener('input', render);
  render();
})();


