// Lista oficial de tus compañeros ordenados alfabéticamente por apellido (24 alumnos)
const DEFAULT_STUDENTS = [
  "Anchelia Ayarza, Dangelo B.",
  "Atamari Quispe, Luz Jeandet",
  "Cachachi Zapata, Francisco Martin",
  "Choque Lujano, Jhon Alvaro",
  "Chunga Galan, Marco",
  "Chuquimuni Infanzon, Ivan Daniel",
  "Cossio Armas, Jeisson",
  "Gallegos Granda, Luana",
  "Gómez Bereche, Ashly Jeramy",
  "Huaman Dominguez, Adrian",
  "Inacite Sanchez, Daiha Elizabeth",
  "Jaramillo Huaringa, Jhon G.",
  "Lozano Torres, Eymi Jessel",
  "Mercado Cardenas, Diego",
  "Mor Castañeda, Evelyn",
  "Orihuela Perez, Nelly",
  "Pujay Huanca, Luz Nataly",
  "Ramirez Ananca, Jairo Jhair",
  "Ramirez Quispe, Rossy",
  "Ramos Tupac Yupanqui, Diego Jesús",
  "Rodriguez Ramos, Gary Andy",
  "Torres Quispe, Julio Cesar",
  "Vargas Tello, Omar Alexander",
  "Yupanqui Bereche, Alejandro"
];

let currentMonth = 'OCTUBRE';
let db = {};

function initDB() {
  // Forzar limpieza si la cantidad anterior no coincide para evitar errores en pantalla
  let savedVersion = localStorage.getItem('unfv_version_2026');
  if (savedVersion !== 'v2_real_24') {
    localStorage.removeItem('unfv_attendance_2026');
    localStorage.setItem('unfv_version_2026', 'v2_real_24');
  }

  db = JSON.parse(localStorage.getItem('unfv_attendance_2026')) || {};

  ['OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'].forEach(m => {
    if (!db[m] || db[m].length !== DEFAULT_STUDENTS.length) {
      db[m] = DEFAULT_STUDENTS.map((name, idx) => ({
        id: idx + 1,
        name: name,
        c1: 'P', c2: 'P', c3: 'P', c4: 'P'
      }));
    }
  });
  saveDB();
}

function saveDB() {
  localStorage.setItem('unfv_attendance_2026', JSON.stringify(db));
}

function renderTable() {
  const tbody = document.getElementById('students-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let totalP = 0, totalF = 0, totalM = 0;

  if (!db[currentMonth]) return;

  db[currentMonth].forEach((st, index) => {
    const classes = [st.c1, st.c2, st.c3, st.c4];
    const pCount = classes.filter(c => c === 'P').length;
    const fCount = classes.filter(c => c === 'F').length;
    const mCount = classes.filter(c => c === 'M').length;

    totalP += pCount;
    totalF += fCount;
    totalM += mCount;

    // Cálculo de Nota: Base 20 - (2 * Faltas) - (2 * Sanciones)
    let score = Math.max(0, 20 - (2 * fCount) - (2 * mCount));

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${st.id}</strong></td>
      <td style="text-align: left;">
        <input type="text" class="input-name" value="${st.name}" onchange="updateName(${index}, this.value)">
      </td>
      <td><button class="btn-status ${st.c1}" onclick="toggleStatus(${index}, 'c1')">${st.c1}</button></td>
      <td><button class="btn-status ${st.c2}" onclick="toggleStatus(${index}, 'c2')">${st.c2}</button></td>
      <td><button class="btn-status ${st.c3}" onclick="toggleStatus(${index}, 'c3')">${st.c3}</button></td>
      <td><button class="btn-status ${st.c4}" onclick="toggleStatus(${index}, 'c4')">${st.c4}</button></td>
      <td><strong style="color: var(--color-present);">${pCount}</strong></td>
      <td><strong style="color: var(--color-absent);">${fCount}</strong></td>
      <td><strong style="color: var(--color-bad);">${mCount}</strong></td>
      <td>
        <span class="score-badge ${score >= 11 ? 'score-good' : 'score-bad'}">${score.toFixed(1)}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('stat-total').innerText = DEFAULT_STUDENTS.length;
  document.getElementById('stat-present').innerText = totalP;
  document.getElementById('stat-absent').innerText = totalF;
  document.getElementById('stat-bad').innerText = totalM;
}

function toggleStatus(index, classKey) {
  const states = ['P', 'F', 'M'];
  const current = db[currentMonth][index][classKey];
  const next = states[(states.indexOf(current) + 1) % states.length];
  db[currentMonth][index][classKey] = next;
  saveDB();
  renderTable();
}

function updateName(index, newName) {
  ['OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'].forEach(m => {
    if (db[m] && db[m][index]) {
      db[m][index].name = newName;
    }
  });
  saveDB();
}

function changeMonth(month) {
  currentMonth = month;
  document.querySelectorAll('.btn-month').forEach(btn => {
    btn.classList.toggle('active', btn.innerText === month);
  });
  const monthSpan = document.getElementById('print-month-name');
  if (monthSpan) monthSpan.innerText = month;
  renderTable();
}

function generateReportPDF() {
  window.print();
}

function resetData() {
  if (confirm('¿Desea restablecer los registros de asistencia?')) {
    localStorage.removeItem('unfv_attendance_2026');
    localStorage.removeItem('unfv_version_2026');
    initDB();
    renderTable();
  }
}

// Ejecutar al cargar la página
window.onload = function() {
  initDB();
  renderTable();
};