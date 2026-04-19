'use strict';

function navigateTo(subject) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.subject === subject));
  const page = document.getElementById('page-' + subject);
  if (page) page.classList.add('active');
  state.currentSubject = subject;
  document.getElementById('mobile-nav').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.subject));
});

document.querySelectorAll('.subject-card').forEach(card => {
  card.addEventListener('click', () => navigateTo(card.dataset.subject));
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-nav').classList.toggle('hidden');
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const tabId = this.dataset.tab;
    const tabBar = this.closest('.tab-bar');
    tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const section = this.closest('.page');
    section.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  });
});

document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    this.closest('.level-btns').querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const subject = this.closest('.page').id.replace('page-', '');
    state.levels[subject] = this.dataset.level;
  });
});

document.querySelectorAll('.start-quiz-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const quiz = this.dataset.quiz;
    const section = document.getElementById('page-' + quiz);
    section.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    section.querySelector('[data-tab="' + quiz + '-quiz"]').classList.add('active');
    section.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.getElementById(quiz + '-quiz').classList.add('active');
    startQuiz(quiz);
  });
});
