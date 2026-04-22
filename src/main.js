import './style.css';
import { Generators } from './generators.js';

const TOPICS = [
  { id:'t1', title:'Counting on Number Line', icon:'📏', desc:'Step along the number line and count forward' },
  { id:'t2', title:'Addition on Number Line', icon:'🐸', desc:'Hop forward to discover addition visually' },
  { id:'t3', title:'Addition Pattern', icon:'🔗', desc:'Spot the rule and fill the missing number' },
  { id:'t4', title:'Introduction to Addition', icon:'➕', desc:'Combine groups and learn what addition means' },
  { id:'t5', title:'Intellia\'s Method', icon:'🧠', desc:'Split-and-Merge: the smartest way to add!' },
  { id:'t6', title:'Visualisation Bubble', icon:'🫧', desc:'Watch numbers merge inside floating bubbles' }
];

let state = {
  currentView:'dashboard', currentTopicId:null,
  topicItems:[], currentIndex:0, score:0,
  progress: JSON.parse(localStorage.getItem('add_progress')||'{}')
};

const DOM = {
  views: document.querySelectorAll('.view'),
  grid: document.getElementById('topics-grid'),
  btnHome: document.getElementById('btn-home'),
  btnBack: document.getElementById('btn-back'),
  lessonTitle: document.getElementById('lesson-title'),
  scoreVal: document.getElementById('lesson-score-val'),
  scoreMax: document.getElementById('lesson-score-max'),
  phaseLearning: document.getElementById('phase-learning'),
  lSubtitle: document.getElementById('learn-subtitle'),
  lVisual: document.getElementById('learn-visual'),
  lText: document.getElementById('learn-text'),
  btnUnderstood: document.getElementById('btn-understood'),
  phaseTask: document.getElementById('phase-task'),
  tQuestion: document.getElementById('task-question'),
  tVisual: document.getElementById('task-visual'),
  tAnswers: document.getElementById('task-answers'),
  hintContainer: document.getElementById('task-hint-container'),
  btnShowHint: document.getElementById('btn-show-hint'),
  hintText: document.getElementById('hint-text'),
  modalCompletion: document.getElementById('modal-completion'),
  btnNextTopic: document.getElementById('btn-next-topic'),
  completedName: document.getElementById('completed-topic-name'),
  masteryProgress: document.getElementById('mastery-progress')
};

function init() {
  renderDashboard();
  updateProgressHeader();
  DOM.btnHome.onclick = () => navTo('dashboard');
  DOM.btnBack.onclick = () => navTo('dashboard');
  DOM.btnUnderstood.onclick = () => nextItem();
  DOM.btnShowHint.onclick = () => { DOM.hintText.style.display='block'; DOM.btnShowHint.style.display='none'; };
  DOM.btnNextTopic.onclick = () => { DOM.modalCompletion.style.display='none'; navTo('dashboard'); };
}

function navTo(view) {
  DOM.views.forEach(v => v.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
  if(view==='dashboard') renderDashboard();
}

function renderDashboard() {
  DOM.grid.innerHTML = '';
  TOPICS.forEach((t,i) => {
    const done = state.progress[t.id];
    const card = document.createElement('div');
    card.className = 'topic-card glass';
    card.innerHTML = `
      <div class="topic-icon">${t.icon}</div>
      <div class="topic-title">Topic ${i+1}: ${t.title}</div>
      <div class="topic-desc">${t.desc}</div>
      <div class="topic-status ${done?'done':''}">${done?'✨ Mastered':'▶️ Begin Concept'}</div>`;
    card.onclick = () => startLesson(t);
    DOM.grid.appendChild(card);
  });
}

function updateProgressHeader() {
  const n = Object.keys(state.progress).length;
  DOM.masteryProgress.style.width = `${(n/TOPICS.length)*100}%`;
}

function startLesson(topic) {
  state.currentTopicId = topic.id;
  state.topicItems = Generators[topic.id]();
  state.currentIndex = 0;
  state.score = 0;
  DOM.lessonTitle.textContent = topic.title;
  DOM.scoreVal.textContent = '0';
  DOM.scoreMax.textContent = state.topicItems.filter(i => !i.isLearning).length;
  navTo('lesson');
  renderCurrentItem();
}

function renderCurrentItem() {
  const item = state.topicItems[state.currentIndex];
  if(!item){ completeLesson(); return; }

  if(item.isLearning) {
    DOM.phaseLearning.style.display = 'block';
    DOM.phaseTask.style.display = 'none';
    DOM.phaseLearning.style.animation = 'none';
    DOM.phaseLearning.offsetHeight;
    DOM.phaseLearning.style.animation = null;
    DOM.lSubtitle.textContent = item.title;
    DOM.lText.innerHTML = item.text;
    DOM.lVisual.innerHTML = item.visual;
  } else {
    DOM.phaseLearning.style.display = 'none';
    DOM.phaseTask.style.display = 'block';
    DOM.phaseTask.style.animation = 'none';
    DOM.phaseTask.offsetHeight;
    DOM.phaseTask.style.animation = null;
    DOM.tQuestion.innerHTML = item.q;
    DOM.tVisual.innerHTML = item.visual || '';

    if(item.hint) {
      DOM.hintContainer.style.display = 'block';
      DOM.hintText.style.display = 'none';
      DOM.hintText.innerHTML = `<strong>Hint:</strong> ${item.hint}`;
      DOM.btnShowHint.style.display = 'block';
    } else {
      DOM.hintContainer.style.display = 'none';
    }

    DOM.tAnswers.innerHTML = '';
    item.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'ans-btn';
      btn.textContent = c;
      btn.onclick = () => handleAnswer(c == item.ans, item.ans, btn);
      DOM.tAnswers.appendChild(btn);
    });
  }
}

function nextItem() { state.currentIndex++; renderCurrentItem(); }

function handleAnswer(ok, correctAns, btn) {
  Array.from(DOM.tAnswers.children).forEach(b => b.style.pointerEvents='none');
  if(ok) {
    btn.classList.add('correct');
    state.score++;
    DOM.scoreVal.textContent = state.score;
    setTimeout(nextItem, 800);
  } else {
    btn.classList.add('wrong');
    Array.from(DOM.tAnswers.children).forEach(b => {
      if(b.textContent == correctAns) b.style.border = '2px solid var(--success)';
    });
    setTimeout(nextItem, 1500);
  }
}

function completeLesson() {
  state.progress[state.currentTopicId] = true;
  localStorage.setItem('add_progress', JSON.stringify(state.progress));
  updateProgressHeader();
  const t = TOPICS.find(x => x.id === state.currentTopicId);
  DOM.completedName.textContent = t.title;
  DOM.modalCompletion.style.display = 'flex';
}

init();
