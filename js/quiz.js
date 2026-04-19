'use strict';

function startQuiz(subject) {
  const area = document.getElementById(subject + '-quiz-area');
  const questions = generateQuestions(subject);
  const quiz = { questions, current: 0, correct: 0, subject };
  state.quizzes[subject] = quiz;
  renderQuestion(area, quiz);
}

function renderQuestion(area, quiz) {
  if (quiz.current >= quiz.questions.length) {
    renderResults(area, quiz);
    return;
  }
  const q = quiz.questions[quiz.current];
  const total = quiz.questions.length;
  const progress = Math.round((quiz.current / total) * 100);

  let html = `
    <div class="quiz-progress">
      <span>Soal ${quiz.current + 1} dari ${total}</span>
      <span>${quiz.correct} benar</span>
    </div>
    <div class="progress-bar-wrap"><div class="progress-bar" style="width:${progress}%"></div></div>
    <div class="question-number">Pertanyaan ${quiz.current + 1}</div>
    <div class="question-text">${q.question}</div>
  `;

  if (q.type === 'mcq') {
    html += `<div class="options-grid">`;
    q.options.forEach((opt, i) => {
      html += `<button class="option-btn" data-index="${i}">${opt}</button>`;
    });
    html += `</div>`;
  } else if (q.type === 'input') {
    html += `
      <div class="input-answer-wrap">
        <input type="number" class="answer-input" id="answerInput" placeholder="Ketik jawaban..." autocomplete="off" />
        <button class="submit-answer-btn" id="submitAnswer">✅ Jawab</button>
      </div>
    `;
  }

  html += `
    <div class="feedback-box" id="feedbackBox"></div>
    <button class="next-btn" id="nextBtn">${quiz.current + 1 < total ? 'Soal Berikutnya →' : '🏆 Lihat Hasil'}</button>
  `;

  area.innerHTML = html;

  if (q.type === 'mcq') {
    area.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        handleMCQAnswer(area, quiz, q, parseInt(this.dataset.index));
      });
    });
  } else if (q.type === 'input') {
    const inputEl = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitAnswer');
    submitBtn.addEventListener('click', () => {
      handleInputAnswer(area, quiz, q, parseInt(inputEl.value.trim()), inputEl, submitBtn);
    });
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') submitBtn.click(); });
    inputEl.focus();
  }

  document.getElementById('nextBtn').addEventListener('click', () => {
    quiz.current++;
    renderQuestion(area, quiz);
  });
}

function handleMCQAnswer(area, quiz, q, chosen) {
  area.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  const btns = area.querySelectorAll('.option-btn');
  btns[q.correct].classList.add('correct');
  if (chosen !== q.correct) {
    btns[chosen].classList.add('wrong');
    showFeedback(area, false, q.explanation);
  } else {
    showFeedback(area, true, q.explanation);
    quiz.correct++;
    updateScore(quiz.subject, 10);
  }
  document.getElementById('nextBtn').classList.add('show');
}

function handleInputAnswer(area, quiz, q, val, inputEl, submitBtn) {
  submitBtn.disabled = true;
  inputEl.disabled = true;
  if (val === q.correct) {
    inputEl.classList.add('correct');
    showFeedback(area, true, q.explanation);
    quiz.correct++;
    updateScore(quiz.subject, 10);
  } else {
    inputEl.classList.add('wrong');
    showFeedback(area, false, `Jawaban yang benar: ${q.correct}. ${q.explanation || ''}`);
  }
  document.getElementById('nextBtn').classList.add('show');
}

function showFeedback(area, isCorrect, msg) {
  const fb = document.getElementById('feedbackBox');
  fb.className = 'feedback-box show ' + (isCorrect ? 'correct' : 'wrong');
  fb.innerHTML = isCorrect
    ? `✅ <span>Benar! Hebat sekali! ${msg || ''}</span>`
    : `❌ <span>Kurang tepat. ${msg || ''}</span>`;
}

function renderResults(area, quiz) {
  const total = quiz.questions.length;
  const pct = Math.round((quiz.correct / total) * 100);
  let emoji, title, msg, stars;
  if (pct === 100)     { emoji = '🏆'; title = 'Sempurna!';          msg = 'Luar biasa! Kamu menjawab semua soal dengan benar!'; stars = '⭐⭐⭐'; }
  else if (pct >= 70)  { emoji = '🎉'; title = 'Bagus Sekali!';      msg = 'Kerja keras kamu membuahkan hasil yang bagus!';      stars = '⭐⭐'; }
  else if (pct >= 40)  { emoji = '😊'; title = 'Lumayan!';           msg = 'Terus berlatih ya, kamu pasti bisa lebih baik!';    stars = '⭐'; }
  else                 { emoji = '📖'; title = 'Perlu Belajar Lagi!'; msg = 'Jangan menyerah! Pelajari lagi materinya ya!';      stars = ''; }

  if (pct >= 70) launchConfetti();

  area.innerHTML = `
    <div class="quiz-results">
      <div class="result-emoji">${emoji}</div>
      <div class="result-title">${title}</div>
      <div class="result-stars">${stars}</div>
      <div class="result-score">${quiz.correct}/${total}</div>
      <div class="result-msg">${msg}<br><strong>${pct}%</strong> soal dijawab dengan benar.</div>
      <div class="result-actions">
        <button class="retry-btn" id="retryBtn">🔄 Coba Lagi</button>
        <button class="back-materi-btn" id="backMateri">📖 Kembali ke Materi</button>
      </div>
    </div>
  `;

  document.getElementById('retryBtn').addEventListener('click', () => {
    quiz.correct = 0;
    quiz.current = 0;
    quiz.questions = generateQuestions(quiz.subject);
    renderQuestion(area, quiz);
  });
  document.getElementById('backMateri').addEventListener('click', () => {
    const section = document.getElementById('page-' + quiz.subject);
    section.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    section.querySelector('[data-tab="' + quiz.subject + '-materi"]').classList.add('active');
    section.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.getElementById(quiz.subject + '-materi').classList.add('active');
  });
}
