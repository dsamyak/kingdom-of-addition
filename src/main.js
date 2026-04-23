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
  topicItems:[], currentIndex:0, score:0, streak:0,
  progress: JSON.parse(localStorage.getItem('add_progress_v2')||'{}')
};

const DOM = {
  views: document.querySelectorAll('.view'),
  grid: document.getElementById('topics-grid'),
  btnHome: document.getElementById('btn-home'),
  btnBack: document.getElementById('btn-back'),
  lessonTitle: document.getElementById('lesson-title'),
  scoreVal: document.getElementById('lesson-score-val'),
  scoreMax: document.getElementById('lesson-score-max'),
  stepIndicators: document.getElementById('step-indicators'),
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
  masteryProgress: document.getElementById('mastery-progress'),
  headerStreak: document.getElementById('header-streak'),
  streakNum: document.querySelector('.streak-num')
};

function init() {
  initParticles();
  renderDashboard();
  updateProgressHeader();
  DOM.btnHome.onclick = () => navTo('dashboard');
  DOM.btnBack.onclick = () => navTo('dashboard');
  DOM.btnUnderstood.onclick = () => nextItem();
  DOM.btnShowHint.onclick = () => { DOM.hintText.style.display='block'; DOM.btnShowHint.style.display='none'; };
  DOM.btnNextTopic.onclick = () => { DOM.modalCompletion.style.display='none'; navTo('dashboard'); };
}

function initParticles() {
  const bg = document.getElementById('bg-particles');
  for(let i=0; i<15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random()*8 + 4;
    p.style.width = size+'px'; p.style.height = size+'px';
    p.style.left = Math.random()*100 + 'vw';
    p.style.background = ['#7f5af0','#e53170','#ff8906','#2cb67d'][Math.floor(Math.random()*4)];
    p.style.animationDuration = (Math.random()*15 + 10) + 's';
    p.style.animationDelay = Math.random()*10 + 's';
    bg.appendChild(p);
  }
}

function navTo(view) {
  DOM.views.forEach(v => v.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
  if(view==='dashboard') renderDashboard();
  if(view==='dashboard') {
    state.streak = 0;
    updateStreak();
  }
}

function renderDashboard() {
  DOM.grid.innerHTML = '';
  TOPICS.forEach((t,i) => {
    const done = state.progress[t.id];
    const card = document.createElement('div');
    card.className = 'topic-card glass';
    card.innerHTML = `
      <div class="topic-number">${i+1}</div>
      <div class="topic-icon">${t.icon}</div>
      <div class="topic-title">${t.title}</div>
      <div class="topic-desc">${t.desc}</div>
      <div class="topic-status ${done?'done':''}">
        ${done ? '✨ <span>Mastered</span>' : '▶️ <span>Begin Concept</span>'}
      </div>`;
    card.onclick = () => startLesson(t);
    DOM.grid.appendChild(card);
  });
}

function updateProgressHeader() {
  const n = Object.keys(state.progress).length;
  DOM.masteryProgress.style.width = `${(n/TOPICS.length)*100}%`;
}

function updateStreak() {
  if(state.streak > 1) {
    DOM.headerStreak.classList.add('visible');
    DOM.streakNum.textContent = state.streak;
    DOM.headerStreak.classList.remove('bump');
    void DOM.headerStreak.offsetWidth;
    DOM.headerStreak.classList.add('bump');
  } else {
    DOM.headerStreak.classList.remove('visible');
  }
}

function startLesson(topic) {
  state.currentTopicId = topic.id;
  state.topicItems = Generators[topic.id]();
  state.currentIndex = 0;
  state.score = 0;
  state.streak = 0;
  updateStreak();
  
  DOM.lessonTitle.textContent = topic.title;
  DOM.scoreVal.textContent = '0';
  DOM.scoreMax.textContent = state.topicItems.filter(i => !i.isLearning).length;
  
  renderStepIndicators();
  navTo('lesson');
  renderCurrentItem();
}

function renderStepIndicators() {
  DOM.stepIndicators.innerHTML = '';
  state.topicItems.forEach((item, i) => {
    const dot = document.createElement('div');
    dot.className = `step-dot ${item.isLearning ? 'learn' : 'task'}`;
    dot.id = `step-dot-${i}`;
    DOM.stepIndicators.appendChild(dot);
  });
}

function updateStepIndicators() {
  state.topicItems.forEach((_, i) => {
    const dot = document.getElementById(`step-dot-${i}`);
    if(!dot) return;
    dot.classList.remove('active', 'done');
    if (i < state.currentIndex) dot.classList.add('done');
    else if (i === state.currentIndex) dot.classList.add('active');
  });
}

function renderCurrentItem() {
  updateStepIndicators();
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
      DOM.btnShowHint.style.display = 'flex';
    } else {
      DOM.hintContainer.style.display = 'none';
    }

    DOM.tAnswers.innerHTML = '';
    item.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'ans-btn';
      btn.textContent = c;
      btn.onclick = (e) => handleAnswer(c == item.ans, item.ans, btn, e);
      DOM.tAnswers.appendChild(btn);
    });
  }
}

function nextItem() { state.currentIndex++; renderCurrentItem(); }

function showFloatingScore(x, y) {
  const el = document.createElement('div');
  el.className = 'float-score';
  el.textContent = '+1';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#7f5af0', '#e53170', '#ff8906', '#2cb67d', '#06b6d4'];
  
  for(let i=0; i<100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2 + 100,
      r: Math.random() * 6 + 2,
      dx: Math.random() * 20 - 10,
      dy: Math.random() * -15 - 5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  
  let frame = 0;
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let active = false;
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.5; // gravity
      if(p.y < canvas.height) active = true;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    if(active && frame < 100) {
      frame++;
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  }
  animate();
}

function handleAnswer(ok, correctAns, btn, event) {
  Array.from(DOM.tAnswers.children).forEach(b => b.style.pointerEvents='none');
  if(ok) {
    btn.classList.add('correct');
    state.score++;
    state.streak++;
    updateStreak();
    DOM.scoreVal.textContent = state.score;
    
    // Floating score near click
    if(event) {
      showFloatingScore(event.clientX, event.clientY);
    }
    
    setTimeout(nextItem, 800);
  } else {
    btn.classList.add('wrong');
    state.streak = 0;
    updateStreak();
    Array.from(DOM.tAnswers.children).forEach(b => {
      if(b.textContent == correctAns) {
        b.style.border = '2px solid var(--success)';
        b.style.background = 'rgba(44,182,125,0.1)';
      }
    });
    setTimeout(nextItem, 1500);
  }
}

function completeLesson() {
  state.progress[state.currentTopicId] = true;
  localStorage.setItem('add_progress_v2', JSON.stringify(state.progress));
  updateProgressHeader();
  
  fireConfetti();
  
  const t = TOPICS.find(x => x.id === state.currentTopicId);
  DOM.completedName.textContent = t.title;
  DOM.modalCompletion.style.display = 'flex';
}

init();
