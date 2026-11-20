const equipmentOptions = [
  { id: 'dumbbells', name: 'Dumbbells', icon: '⬡' },
  { id: 'barbell', name: 'Barbell', icon: '↔' },
  { id: 'kettlebell', name: 'Kettlebell', icon: '♧' },
  { id: 'bands', name: 'Resistance bands', icon: '〰' },
  { id: 'bench', name: 'Bench', icon: '▰' },
];

const exercises = [
  { id: 'squat', name: 'Bodyweight squat', group: 'legs', equipment: [], focus: 'LEGS & GLUTES', reps: 12, cue: 'Sit back and down, then drive through your heels.' },
  { id: 'goblet', name: 'Goblet squat', group: 'legs', equipment: ['dumbbells'], focus: 'LEGS & GLUTES', reps: 10, cue: 'Hold the weight at your chest and sit into your squat.' },
  { id: 'barbell-squat', name: 'Barbell squat', group: 'legs', equipment: ['barbell'], focus: 'LEGS & GLUTES', reps: 8, cue: 'Brace your core and lower with control.' },
  { id: 'kettlebell-squat', name: 'Kettlebell squat', group: 'legs', equipment: ['kettlebell'], focus: 'LEGS & GLUTES', reps: 10, cue: 'Hold the bell close and keep your chest lifted.' },
  { id: 'lunge', name: 'Reverse lunge', group: 'legs', equipment: [], focus: 'LEGS & GLUTES', reps: 10, cue: 'Step back softly and drive through your front foot.' },
  { id: 'pushup', name: 'Push-up', group: 'push', equipment: [], focus: 'CHEST & TRICEPS', reps: 10, cue: 'Keep a straight line from your head to your heels.' },
  { id: 'floor-press', name: 'Dumbbell floor press', group: 'push', equipment: ['dumbbells'], focus: 'CHEST & TRICEPS', reps: 10, cue: 'Press up from the floor with control.' },
  { id: 'bench-press', name: 'Barbell bench press', group: 'push', equipment: ['barbell', 'bench'], focus: 'CHEST & TRICEPS', reps: 8, cue: 'Lower to your chest, then press away steadily.' },
  { id: 'incline-pushup', name: 'Incline push-up', group: 'push', equipment: ['bench'], focus: 'CHEST & TRICEPS', reps: 12, cue: 'Place your hands on a stable bench and lower slowly.' },
  { id: 'row', name: 'Dumbbell row', group: 'pull', equipment: ['dumbbells'], focus: 'BACK & ARMS', reps: 10, cue: 'Pull your elbow back, keeping your shoulders level.' },
  { id: 'band-row', name: 'Resistance band row', group: 'pull', equipment: ['bands'], focus: 'BACK & ARMS', reps: 12, cue: 'Squeeze your shoulder blades together as you pull.' },
  { id: 'barbell-row', name: 'Barbell row', group: 'pull', equipment: ['barbell'], focus: 'BACK & ARMS', reps: 10, cue: 'Hinge at the hips and pull toward your waist.' },
  { id: 'superman', name: 'Superman pull', group: 'pull', equipment: [], focus: 'BACK & ARMS', reps: 12, cue: 'Lift gently and draw your elbows toward your sides.' },
  { id: 'glute-bridge', name: 'Glute bridge', group: 'hinge', equipment: [], focus: 'GLUTES & HAMSTRINGS', reps: 12, cue: 'Squeeze your glutes at the top of each rep.' },
  { id: 'deadlift', name: 'Dumbbell Romanian deadlift', group: 'hinge', equipment: ['dumbbells'], focus: 'GLUTES & HAMSTRINGS', reps: 10, cue: 'Hinge at your hips with a soft bend in your knees.' },
  { id: 'kettlebell-deadlift', name: 'Kettlebell deadlift', group: 'hinge', equipment: ['kettlebell'], focus: 'GLUTES & HAMSTRINGS', reps: 10, cue: 'Push the floor away and stand tall.' },
  { id: 'plank', name: 'Plank', group: 'core', equipment: [], focus: 'CORE', reps: 30, unit: 'sec', cue: 'Brace your core and breathe steadily.' },
  { id: 'dead-bug', name: 'Dead bug', group: 'core', equipment: [], focus: 'CORE', reps: 10, cue: 'Move slowly while keeping your lower back grounded.' },
];

const storageKey = 'superset-workout-v1';
const groups = ['legs', 'push', 'pull', 'hinge', 'core'];
const defaults = { equipment: ['dumbbells'], plan: [], history: [] };
let state;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  state = saved && Array.isArray(saved.equipment) && Array.isArray(saved.plan) && Array.isArray(saved.history) ? saved : structuredClone(defaults);
} catch {
  state = structuredClone(defaults);
}

const $ = selector => document.querySelector(selector);
const findExercise = id => exercises.find(exercise => exercise.id === id);
const available = exercise => exercise.equipment.every(item => state.equipment.includes(item));
const makeSets = exercise => Array.from({ length: 3 }, () => ({ reps: exercise.reps, weight: '', done: false }));

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { notify('Your browser could not save this workout.'); }
}

function notify(message) {
  const notice = $('#notice');
  notice.textContent = message;
  notice.classList.add('visible');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => notice.classList.remove('visible'), 3000);
}

function buildWorkout() {
  state.plan = groups.map(group => {
    const options = exercises.filter(exercise => exercise.group === group && available(exercise));
    const exercise = options.find(item => item.equipment.length > 0) || options[0];
    return { id: exercise.id, sets: makeSets(exercise) };
  });
  save();
  render();
}

function renderEquipment() {
  $('#equipment').innerHTML = equipmentOptions.map(item => `
    <button class="equipment-chip ${state.equipment.includes(item.id) ? 'selected' : ''}" type="button" data-equipment="${item.id}" aria-pressed="${state.equipment.includes(item.id)}">
      <span class="chip-icon">${item.icon}</span><span>${item.name}</span><span class="chip-check">${state.equipment.includes(item.id) ? '✓' : '+'}</span>
    </button>`).join('');
}

function renderWorkout() {
  const total = state.plan.reduce((sum, item) => sum + item.sets.length, 0);
  const done = state.plan.reduce((sum, item) => sum + item.sets.filter(set => set.done).length, 0);
  const percent = total ? Math.round(done / total * 100) : 0;
  $('#progress-text').textContent = `${done} of ${total} sets complete`;
  $('#progress-percent').textContent = `${percent}%`;
  $('#progress-fill').style.width = `${percent}%`;
  $('.progress-track').setAttribute('aria-valuenow', percent);
  $('#exercise-list').innerHTML = state.plan.map((item, index) => {
    const exercise = findExercise(item.id);
    if (!exercise) return '';
    const equipment = exercise.equipment.length ? exercise.equipment.map(id => equipmentOptions.find(option => option.id === id)?.name).filter(Boolean).join(' + ') : 'Bodyweight';
    return `<article class="exercise-card">
      <div class="exercise-summary">
        <div class="exercise-number">${String(index + 1).padStart(2, '0')} <span> / 0${state.plan.length}</span></div>
        <div class="exercise-art art-${exercise.group}" aria-hidden="true"><span>✳</span><b>${exercise.group === 'core' ? '◉' : '↗'}</b></div>
        <div class="exercise-info"><div class="focus">${exercise.focus}</div><h3>${exercise.name}</h3><div class="exercise-equipment">${equipment}</div><p>${exercise.cue}</p>
          <button class="swap-button" type="button" data-swap="${index}">⇄ &nbsp; Swap exercise</button></div>
      </div>
      <div class="sets-area">
        <div class="sets-title"><span>YOUR SETS</span><span>CHECK THEM OFF AS YOU GO</span></div>
        <div class="set-head"><span>SET</span><span>${exercise.unit === 'sec' ? 'SECONDS' : 'REPS'}</span><span>WEIGHT <small>(KG)</small></span><span>DONE</span><span></span></div>
        ${item.sets.map((set, setIndex) => `<div class="set-row ${set.done ? 'completed' : ''}">
          <span class="set-index">${String(setIndex + 1).padStart(2, '0')}</span>
          <input type="number" min="0" max="9999" step="1" value="${Number(set.reps) || 0}" data-field="reps" data-exercise="${index}" data-set="${setIndex}" aria-label="Set ${setIndex + 1} ${exercise.unit === 'sec' ? 'seconds' : 'reps'}">
          <input type="number" min="0" max="9999" step="0.5" value="${set.weight === '' ? '' : Number(set.weight) || 0}" placeholder="—" data-field="weight" data-exercise="${index}" data-set="${setIndex}" aria-label="Set ${setIndex + 1} weight in kilograms">
          <label class="check-wrap"><input type="checkbox" data-field="done" data-exercise="${index}" data-set="${setIndex}" ${set.done ? 'checked' : ''} aria-label="Mark set ${setIndex + 1} complete"><span>✓</span></label>
          <button class="remove-set" type="button" data-remove="${index}" data-set="${setIndex}" aria-label="Remove set ${setIndex + 1}" ${item.sets.length === 1 ? 'disabled' : ''}>×</button>
        </div>`).join('')}
        <button class="add-set" type="button" data-add="${index}">+ &nbsp; Add a set</button>
      </div>
    </article>`;
  }).join('');
}

function renderHistory() {
  $('#history-list').innerHTML = state.history.length
    ? state.history.map(entry => `<details class="history-item"><summary><span class="history-check">✓</span><span><strong>Workout complete</strong><small>${new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</small></span><span>${Number(entry.sets) || 0} SETS <span class="history-arrow">⌄</span></span></summary>
      <div class="history-details">${(entry.exercises || []).map(item => {
        const exercise = findExercise(item.id);
        if (!exercise) return '';
        return `<div><strong>${exercise.name}</strong><span>${item.sets.map(set => `${Number(set.reps) || 0} ${exercise.unit === 'sec' ? 'sec' : 'reps'}${set.weight !== '' ? ` · ${Number(set.weight) || 0} kg` : ''}`).join(' / ')}</span></div>`;
      }).join('')}</div></details>`).join('')
    : '<div class="empty-history"><span>✳</span><div><strong>Fresh start, right here.</strong><small>Finish a workout and it’ll show up here.</small></div></div>';
}

function render() {
  renderEquipment();
  renderWorkout();
  renderHistory();
}

$('#equipment').addEventListener('click', event => {
  const button = event.target.closest('[data-equipment]');
  if (!button) return;
  const id = button.dataset.equipment;
  state.equipment = state.equipment.includes(id) ? state.equipment.filter(item => item !== id) : [...state.equipment, id];
  save();
  renderEquipment();
});

$('#generate').addEventListener('click', () => {
  if (state.plan.some(item => item.sets.some(set => set.done)) && !confirm('Build a new workout? Your current set progress will be cleared.')) return;
  buildWorkout();
  notify('Your workout is ready.');
});

$('#exercise-list').addEventListener('click', event => {
  const swap = event.target.closest('[data-swap]');
  const add = event.target.closest('[data-add]');
  const remove = event.target.closest('[data-remove]');
  if (swap) {
    const index = Number(swap.dataset.swap);
    const current = findExercise(state.plan[index].id);
    const options = exercises.filter(exercise => exercise.group === current.group && available(exercise));
    if (options.length < 2) { notify('No other exercise is available for this equipment.'); return; }
    if (state.plan[index].sets.some(set => set.done) && !confirm('Swap this exercise? Its set progress will be cleared.')) return;
    const next = options[(options.findIndex(exercise => exercise.id === current.id) + 1) % options.length];
    state.plan[index] = { id: next.id, sets: makeSets(next) };
  } else if (add) {
    const item = state.plan[Number(add.dataset.add)];
    const previous = item.sets[item.sets.length - 1];
    item.sets.push({ reps: previous.reps, weight: previous.weight, done: false });
  } else if (remove) {
    const item = state.plan[Number(remove.dataset.remove)];
    if (item.sets.length > 1) item.sets.splice(Number(remove.dataset.set), 1);
  } else return;
  save();
  renderWorkout();
});

$('#exercise-list').addEventListener('change', event => {
  const input = event.target.closest('[data-field]');
  if (!input) return;
  const set = state.plan[Number(input.dataset.exercise)].sets[Number(input.dataset.set)];
  if (input.dataset.field === 'done') set.done = input.checked;
  else {
    set[input.dataset.field] = input.value === '' ? (input.dataset.field === 'weight' ? '' : 0) : Math.min(9999, Math.max(0, Number(input.value) || 0));
    input.value = set[input.dataset.field];
  }
  save();
  if (input.dataset.field === 'done') renderWorkout();
});

$('#finish').addEventListener('click', () => {
  const completed = state.plan.reduce((sum, item) => sum + item.sets.filter(set => set.done).length, 0);
  if (!completed) { notify('Complete at least one set before finishing.'); return; }
  const loggedExercises = state.plan.map(item => ({
    id: item.id,
    sets: item.sets.filter(set => set.done).map(set => ({ reps: set.reps, weight: set.weight })),
  })).filter(item => item.sets.length);
  state.history.unshift({ date: new Date().toISOString(), sets: completed, exercises: loggedExercises });
  state.history = state.history.slice(0, 20);
  state.plan.forEach(item => item.sets.forEach(set => { set.done = false; }));
  save();
  render();
  notify('Workout saved. Nice work!');
});

if (!state.plan.length || state.plan.some(item => !findExercise(item.id) || !Array.isArray(item.sets) || !item.sets.length)) buildWorkout();
else render();
