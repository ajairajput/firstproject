const STORAGE_KEY = 'renovation-tracker-tasks-v1';
const THEME_KEY = 'renovation-tracker-theme';

const CATEGORIES = [
  'Structural & Systems',
  'Exterior',
  'Kitchen',
  'Bathroom',
  'Flooring',
  'Energy Efficiency',
  'Staging & Cosmetic',
];

const DEFAULT_TASKS = [
  { title: 'Roof inspection & repair leaks/damaged shingles', category: 'Structural & Systems', priority: 'Must-Fix', cost: 800, notes: 'Inspectors flag this fast; fix before listing, not after an offer.' },
  { title: 'Electrical panel & wiring safety check', category: 'Structural & Systems', priority: 'Must-Fix', cost: 600, notes: 'Upgrade if outdated (fuse box, knob-and-tube) — common in older Quincy housing stock.' },
  { title: 'Plumbing leak check & repair', category: 'Structural & Systems', priority: 'Must-Fix', cost: 400, notes: 'Check under sinks, water heater, and exterior spigots.' },
  { title: 'HVAC/heating system servicing', category: 'Structural & Systems', priority: 'Must-Fix', cost: 250, notes: 'Service + filter/duct check; get a clean-bill-of-health receipt for buyers.' },
  { title: 'Foundation & basement moisture inspection', category: 'Structural & Systems', priority: 'Must-Fix', cost: 500, notes: 'Address any cracks or damp signs — big red flag for South Shore buyers near the coast.' },
  { title: 'Radon test', category: 'Structural & Systems', priority: 'Must-Fix', cost: 200, notes: 'Common ask in MA home inspections; test early so there is time to mitigate if needed.' },
  { title: 'Replace or repaint garage door', category: 'Exterior', priority: 'High-ROI', cost: 1200, notes: 'Consistently the single highest-ROI exterior project.' },
  { title: 'Replace or repaint front entry door', category: 'Exterior', priority: 'High-ROI', cost: 900, notes: 'First thing a buyer touches — make it feel solid and new.' },
  { title: 'Power wash / repaint siding and trim', category: 'Exterior', priority: 'High-ROI', cost: 2500, notes: 'Removes signs of deferred maintenance at a glance.' },
  { title: 'Refresh landscaping & lawn for curb appeal', category: 'Exterior', priority: 'High-ROI', cost: 500, notes: 'Mulch beds, trim shrubs, edge the lawn — cheap and high-impact.' },
  { title: 'Repair driveway/walkway cracks', category: 'Exterior', priority: 'High-ROI', cost: 400, notes: 'Sealcoat or patch before photos are taken.' },
  { title: 'Clean & repair gutters/downspouts', category: 'Exterior', priority: 'High-ROI', cost: 250, notes: 'Cheap fix, but a clogged gutter reads as neglect during a showing.' },
  { title: 'Update kitchen cabinet hardware & fix doors', category: 'Kitchen', priority: 'High-ROI', cost: 200, notes: 'New pulls/hinges make cabinets look updated without a remodel.' },
  { title: 'Update kitchen light fixtures', category: 'Kitchen', priority: 'High-ROI', cost: 300, notes: 'Swap dated fixtures for simple, bright, modern ones.' },
  { title: 'Fresh caulk/grout, minor backsplash touch-up', category: 'Kitchen', priority: 'High-ROI', cost: 350, notes: 'Minor kitchen refresh, not a full remodel — full remodels rarely recoup cost.' },
  { title: 'Re-caulk tub/shower & fix leaks', category: 'Bathroom', priority: 'High-ROI', cost: 150, notes: 'Mold/grime in grout lines is one of the fastest things buyers notice.' },
  { title: 'Update faucet, showerhead & bathroom lighting', category: 'Bathroom', priority: 'High-ROI', cost: 300, notes: 'Cheap fixtures that make the whole room feel refreshed.' },
  { title: 'Refinish hardwood floors', category: 'Flooring', priority: 'High-ROI', cost: 2500, notes: 'One of the highest-ROI projects available — do this if floors show wear.' },
  { title: 'Replace worn carpet in bedrooms', category: 'Flooring', priority: 'Nice-to-Have', cost: 1800, notes: 'Only if visibly worn/stained; neutral tone if replacing.' },
  { title: 'Add/upgrade attic insulation', category: 'Energy Efficiency', priority: 'Nice-to-Have', cost: 2000, notes: 'Good talking point for winter heating costs in MA; may qualify for incentives.' },
  { title: 'Seal drafty windows & doors', category: 'Energy Efficiency', priority: 'Nice-to-Have', cost: 300, notes: 'Cheap weatherstripping fix, matters during a winter showing.' },
  { title: 'Declutter & depersonalize every room', category: 'Staging & Cosmetic', priority: 'Must-Fix', cost: 0, notes: 'Free, and the single highest-leverage staging step.' },
  { title: 'Fresh neutral paint throughout interior', category: 'Staging & Cosmetic', priority: 'High-ROI', cost: 2500, notes: 'Recoups close to 100% of cost; use light, neutral tones.' },
  { title: 'Deep clean entire home', category: 'Staging & Cosmetic', priority: 'Must-Fix', cost: 400, notes: 'Carpets, windows, grout, baseboards — do this last, right before photos.' },
  { title: 'Stage key rooms (living room, primary bedroom, kitchen)', category: 'Staging & Cosmetic', priority: 'High-ROI', cost: 800, notes: 'Focus staging budget on the 3 rooms buyers weight most.' },
  { title: 'Hire a professional photographer', category: 'Staging & Cosmetic', priority: 'Must-Fix', cost: 350, notes: 'In a 1.4-month-supply seller’s market, listing photos are what earns the first showing.' },
  { title: 'In listing copy, highlight beaches/parks/Red Line proximity', category: 'Staging & Cosmetic', priority: 'Nice-to-Have', cost: 0, notes: 'Marketing angle specific to Quincy buyers — see docs/QUINCY_SELLING_GUIDE.md.' },
];

let tasks = [];
let nextId = 1;

function loadTasks() {
  let raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { raw = null; }
  if (raw) {
    try {
      tasks = JSON.parse(raw);
      nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      return;
    } catch (e) { /* fall through to seed */ }
  }
  tasks = DEFAULT_TASKS.map((t) => ({ id: nextId++, status: 'Not Started', ...t }));
  saveTasks();
}

function saveTasks() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) { /* private mode / storage full */ }
}

function priorityClass(p) {
  if (p === 'Must-Fix') return 'priority-must-fix';
  if (p === 'High-ROI') return 'priority-high-roi';
  return 'priority-nice-to-have';
}
function priorityIcon(p) {
  if (p === 'Must-Fix') return '▲';
  if (p === 'High-ROI') return '◆';
  return '○';
}
function statusClass(s) {
  if (s === 'Done') return 'status-done';
  if (s === 'In Progress') return 'status-in-progress';
  return 'status-not-started';
}
function statusIcon(s) {
  if (s === 'Done') return '✓';
  if (s === 'In Progress') return '◐';
  return '○';
}
function fmtMoney(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function renderFilterOptions() {
  const catFilter = document.getElementById('filter-category');
  const formCat = document.querySelector('#add-form select[name="category"]');
  [catFilter, formCat].forEach((sel) => {
    const keepFirst = sel === catFilter;
    sel.innerHTML = keepFirst ? '<option value="">All categories</option>' : '';
    CATEGORIES.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      sel.appendChild(opt);
    });
  });
}

function getFilters() {
  return {
    category: document.getElementById('filter-category').value,
    priority: document.getElementById('filter-priority').value,
    status: document.getElementById('filter-status').value,
    search: document.getElementById('search-box').value.trim().toLowerCase(),
  };
}

function renderAll() {
  renderHero();
  renderKPIs();
  renderCategories();
  renderTaskTable();
}

function renderHero() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'Done').length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('hero-pct').innerHTML = pct + '<sup>%</sup>';
  document.getElementById('hero-meter').style.width = pct + '%';
}

function renderKPIs() {
  const total = tasks.length;
  const notStarted = tasks.filter((t) => t.status === 'Not Started').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const done = tasks.filter((t) => t.status === 'Done').length;
  const remainingCost = tasks.filter((t) => t.status !== 'Done').reduce((sum, t) => sum + (Number(t.cost) || 0), 0);
  document.getElementById('kpi-total').textContent = total;
  document.getElementById('kpi-not-started').textContent = notStarted;
  document.getElementById('kpi-in-progress').textContent = inProgress;
  document.getElementById('kpi-done').textContent = done;
  document.getElementById('kpi-remaining-cost').textContent = fmtMoney(remainingCost);
}

function renderCategories() {
  const wrap = document.getElementById('category-list');
  wrap.innerHTML = '';
  CATEGORIES.forEach((cat) => {
    const inCat = tasks.filter((t) => t.category === cat);
    if (!inCat.length) return;
    const done = inCat.filter((t) => t.status === 'Done').length;
    const pct = Math.round((done / inCat.length) * 100);
    const row = document.createElement('div');
    row.className = 'cat-row';
    row.innerHTML =
      '<div class="name">' + cat + '</div>' +
      '<div class="meter-track"><div class="meter-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="pct">' + pct + '%</div>';
    wrap.appendChild(row);
  });
}

function renderTaskTable() {
  const { category, priority, status, search } = getFilters();
  const body = document.getElementById('task-body');
  body.innerHTML = '';

  const filtered = tasks.filter((t) => {
    if (category && t.category !== category) return false;
    if (priority && t.priority !== priority) return false;
    if (status && t.status !== status) return false;
    if (search && !t.title.toLowerCase().includes(search) && !(t.notes || '').toLowerCase().includes(search)) return false;
    return true;
  });

  filtered.forEach((t) => {
    const tr = document.createElement('tr');

    const catSelect = '<select class="cat-select" data-id="' + t.id + '" data-field="category">' +
      CATEGORIES.map((c) => '<option value="' + c + '"' + (c === t.category ? ' selected' : '') + '>' + c + '</option>').join('') +
      '</select>';

    const priOptions = ['Must-Fix', 'High-ROI', 'Nice-to-Have'];
    const priSelect = '<select class="badge-select ' + priorityClass(t.priority) + '" data-id="' + t.id + '" data-field="priority">' +
      priOptions.map((p) => '<option value="' + p + '"' + (p === t.priority ? ' selected' : '') + '>' + priorityIcon(p) + ' ' + p + '</option>').join('') +
      '</select>';

    const statusOptions = ['Not Started', 'In Progress', 'Done'];
    const statusSelect = '<select class="badge-select ' + statusClass(t.status) + '" data-id="' + t.id + '" data-field="status">' +
      statusOptions.map((s) => '<option value="' + s + '"' + (s === t.status ? ' selected' : '') + '>' + statusIcon(s) + ' ' + s + '</option>').join('') +
      '</select>';

    tr.innerHTML =
      '<td>' + escapeHtml(t.title) + '</td>' +
      '<td>' + catSelect + '</td>' +
      '<td>' + priSelect + '</td>' +
      '<td>' + statusSelect + '</td>' +
      '<td class="cost">' + fmtMoney(t.cost || 0) + '</td>' +
      '<td class="notes">' + escapeHtml(t.notes || '') + '</td>' +
      '<td><button class="delete-btn" data-id="' + t.id + '" title="Delete">✕</button></td>';
    body.appendChild(tr);
  });

  body.querySelectorAll('select[data-field]').forEach((sel) => {
    sel.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.id);
      const field = e.target.dataset.field;
      const task = tasks.find((x) => x.id === id);
      if (!task) return;
      task[field] = e.target.value;
      saveTasks();
      renderAll();
    });
  });
  body.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.id);
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      renderAll();
    });
  });
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { saved = null; }
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  }
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = current ? current === 'dark' : prefersDark;
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
  });
}

function initControls() {
  ['filter-category', 'filter-priority', 'filter-status'].forEach((id) => {
    document.getElementById(id).addEventListener('change', renderTaskTable);
  });
  document.getElementById('search-box').addEventListener('input', renderTaskTable);

  const addBtn = document.getElementById('add-task-btn');
  const addForm = document.getElementById('add-form');
  addBtn.addEventListener('click', () => addForm.classList.toggle('open'));

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(addForm);
    const title = String(fd.get('title') || '').trim();
    if (!title) return;
    tasks.push({
      id: nextId++,
      title,
      category: String(fd.get('category') || CATEGORIES[0]),
      priority: String(fd.get('priority') || 'Nice-to-Have'),
      status: 'Not Started',
      cost: Number(fd.get('cost')) || 0,
      notes: String(fd.get('notes') || ''),
    });
    saveTasks();
    addForm.reset();
    addForm.classList.remove('open');
    renderAll();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderFilterOptions();
  initTheme();
  initControls();
  renderAll();
});
