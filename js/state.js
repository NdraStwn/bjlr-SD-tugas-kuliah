'use strict';

const state = {
  currentSubject: 'home',
  mathLevel: 'easy',
  scores: { math: 0, bahasa: 0, ipa: 0, ips: 0 },
  quizzes: { math: null, bahasa: null, ipa: null, ips: null }
};

function updateScore(subject, pts) {
  state.scores[subject] += pts;
  document.getElementById('score-' + subject).textContent = 'Skor: ' + state.scores[subject];
}
