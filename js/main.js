'use strict';

// ===== STATE =====
const state = {
  currentSubject: 'home',
  mathLevel: 'easy',
  scores: { math: 0, bahasa: 0, ipa: 0, ips: 0 },
  quizzes: { math: null, bahasa: null, ipa: null, ips: null }
};

// ===== NAVIGATION =====
function navigateTo(subject) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.subject === subject));
  const page = document.getElementById('page-' + subject);
  if (page) page.classList.add('active');
  state.currentSubject = subject;
  // close mobile nav
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

// ===== TABS =====
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

// ===== MATH LEVEL =====
document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    state.mathLevel = this.dataset.level;
  });
});

// ===== START QUIZ BUTTONS =====
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

// ===== SCORE =====
function updateScore(subject, pts) {
  state.scores[subject] += pts;
  document.getElementById('score-' + subject).textContent = 'Skor: ' + state.scores[subject];
}

// ===== TOAST =====
function showToast(msg, duration = 2000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.add('hidden'), duration);
}

// ===== CONFETTI =====
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#FF6B6B','#4ECDC4','#FECA57','#A29BFE','#55EFC4','#FF8E53','#6C5CE7'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    w: 6 + Math.random() * 10,
    h: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 2 + Math.random() * 4,
    angle: Math.random() * 360,
    spin: (Math.random() - 0.5) * 5
  }));
  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.y += p.speed;
      p.angle += p.spin;
    });
    if (pieces.some(p => p.y < canvas.height + 20)) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  cancelAnimationFrame(frame);
  draw();
  setTimeout(() => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, canvas.width, canvas.height); }, 3500);
}

// ===== QUIZ ENGINE =====
function startQuiz(subject) {
  const areaId = subject + '-quiz-area';
  const area = document.getElementById(areaId);
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
        const chosen = parseInt(this.dataset.index);
        handleMCQAnswer(area, quiz, q, chosen);
      });
    });
  } else if (q.type === 'input') {
    const inputEl = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitAnswer');
    submitBtn.addEventListener('click', () => {
      const val = parseInt(inputEl.value.trim());
      handleInputAnswer(area, quiz, q, val, inputEl, submitBtn);
    });
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitBtn.click();
    });
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
  if (pct === 100) { emoji = '🏆'; title = 'Sempurna!'; msg = 'Luar biasa! Kamu menjawab semua soal dengan benar!'; stars = '⭐⭐⭐'; }
  else if (pct >= 70) { emoji = '🎉'; title = 'Bagus Sekali!'; msg = 'Kerja keras kamu membuahkan hasil yang bagus!'; stars = '⭐⭐'; }
  else if (pct >= 40) { emoji = '😊'; title = 'Lumayan!'; msg = 'Terus berlatih ya, kamu pasti bisa lebih baik!'; stars = '⭐'; }
  else { emoji = '📖'; title = 'Perlu Belajar Lagi!'; msg = 'Jangan menyerah! Pelajari lagi materinya ya!'; stars = ''; }

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

// ===== QUESTION GENERATORS =====

function generateQuestions(subject) {
  switch (subject) {
    case 'math':    return generateMathQuestions();
    case 'bahasa':  return generateBahasaQuestions();
    case 'ipa':     return generateIPAQuestions();
    case 'ips':     return generateIPSQuestions();
    default: return [];
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeMCQ(question, correctAnswer, wrongAnswers, explanation) {
  const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 3)];
  const shuffled = shuffle(allOptions);
  return {
    type: 'mcq',
    question,
    options: shuffled,
    correct: shuffled.indexOf(correctAnswer),
    explanation: explanation || ''
  };
}

// ----- MATEMATIKA -----
function generateMathQuestions() {
  const level = state.mathLevel;
  const questions = [];
  const ops = shuffle(['+', '-', '×', '÷']);

  for (let i = 0; i < 10; i++) {
    const op = ops[i % ops.length];
    questions.push(makeMathQuestion(op, level));
  }
  return questions;
}

function makeMathQuestion(op, level) {
  let a, b, answer, question;
  const ranges = { easy: [1, 10], medium: [2, 20], hard: [5, 50] };
  const [min, max] = ranges[level];
  const rand = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

  if (op === '+') {
    a = rand(min, max); b = rand(min, max);
    answer = a + b;
    question = `${a} + ${b} = ?`;
  } else if (op === '-') {
    a = rand(min, max); b = rand(min, a);
    answer = a - b;
    question = `${a} − ${b} = ?`;
  } else if (op === '×') {
    const mMax = level === 'easy' ? 5 : level === 'medium' ? 9 : 12;
    a = rand(1, mMax); b = rand(1, mMax);
    answer = a * b;
    question = `${a} × ${b} = ?`;
  } else {
    const dMax = level === 'easy' ? 5 : level === 'medium' ? 9 : 12;
    b = rand(1, dMax); answer = rand(1, dMax);
    a = b * answer;
    question = `${a} ÷ ${b} = ?`;
  }

  const useInput = Math.random() > 0.5;
  if (useInput) {
    return { type: 'input', question, correct: answer, explanation: '' };
  }
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = answer + (Math.floor(Math.random() * 10) - 5);
    if (w !== answer && w >= 0) wrongs.add(w);
  }
  return makeMCQ(question, String(answer), [...wrongs].map(String));
}

// ----- BAHASA INDONESIA -----
const bahasaPool = [
  makeMCQ(
    'Huruf manakah yang termasuk huruf VOKAL?',
    'U', ['B', 'K', 'M'],
    'Huruf vokal adalah A, I, U, E, O.'
  ),
  makeMCQ(
    'Huruf manakah yang termasuk huruf KONSONAN?',
    'R', ['A', 'I', 'O'],
    'Huruf konsonan adalah semua huruf selain A, I, U, E, O.'
  ),
  makeMCQ(
    'Kalimat yang benar menurut EYD adalah...',
    'Budi membaca buku di perpustakaan.',
    ['budi membaca buku di perpustakaan.', 'Budi membaca Buku di perpustakaan!', 'budi Membaca buku Di perpustakaan.'],
    'Kalimat diawali huruf kapital dan diakhiri tanda titik.'
  ),
  makeMCQ(
    'Ejaan yang benar untuk kata "rumah sakit" adalah...',
    'rumah sakit', ['rumahsakit', 'Rumahsakit', 'RUMAH SAKIT'],
    '"Rumah sakit" ditulis dua kata dan huruf kecil (kecuali di awal kalimat).'
  ),
  makeMCQ(
    'Lengkapi kalimat: "Ayah pergi ke _____ untuk membeli sayur."',
    'pasar', ['perpustakaan', 'sekolah', 'rumah sakit'],
    'Sayur dibeli di pasar.'
  ),
  makeMCQ(
    'Kata yang memiliki huruf vokal pertama "I" adalah...',
    'ikan', ['buku', 'meja', 'kursi'],
    'I-kan dimulai dengan vokal "I".'
  ),
  makeMCQ(
    'Kalimat tanya yang benar adalah...',
    'Di mana rumah kamu?', ['Di mana rumah kamu.', 'di mana rumah kamu?', 'Di mana Rumah kamu?'],
    'Kalimat tanya diawali huruf kapital dan diakhiri tanda tanya.'
  ),
  makeMCQ(
    'Berapa jumlah huruf vokal dalam bahasa Indonesia?',
    '5', ['4', '6', '3'],
    'Huruf vokal: A, I, U, E, O — ada 5 huruf.'
  ),
  makeMCQ(
    'Apa fungsi tanda titik (.) dalam kalimat?',
    'Mengakhiri kalimat pernyataan', ['Mengakhiri kalimat tanya', 'Memisahkan kata', 'Memulai kalimat'],
    'Tanda titik digunakan di akhir kalimat pernyataan.'
  ),
  makeMCQ(
    'Kata yang paling tepat untuk melengkapi: "Kucing itu ___ susu."',
    'meminum', ['memakan', 'membaca', 'berlari'],
    '"Meminum" sesuai karena susu adalah minuman.'
  ),
  makeMCQ(
    'Manakah penulisan nama kota yang benar?',
    'Jakarta', ['jakarta', 'JAKARTA', 'jAKARTA'],
    'Nama kota diawali huruf kapital.'
  ),
  makeMCQ(
    'Berapa jumlah huruf dalam alfabet Indonesia?',
    '26', ['24', '28', '25'],
    'Alfabet Indonesia (Latin) terdiri dari 26 huruf.'
  ),
];

function generateBahasaQuestions() {
  return shuffle(bahasaPool).slice(0, 10);
}

// ----- IPA -----
const ipaPool = [
  makeMCQ('Hewan yang menyusui anaknya disebut...', 'Mamalia', ['Reptil', 'Amfibi', 'Serangga'], 'Mamalia menyusui anaknya, contoh: singa, paus, manusia.'),
  makeMCQ('Hewan apakah yang bisa hidup di darat DAN air?', 'Katak', ['Ular', 'Buaya', 'Ayam'], 'Katak adalah hewan amfibi — bisa hidup di darat dan air.'),
  makeMCQ('Bagian tumbuhan yang berfungsi untuk menyerap air adalah...', 'Akar', ['Batang', 'Daun', 'Bunga'], 'Akar menyerap air dan mineral dari tanah.'),
  makeMCQ('Proses tumbuhan membuat makanan sendiri dengan bantuan sinar matahari disebut...', 'Fotosintesis', ['Respirasi', 'Transpirasi', 'Germinasi'], 'Fotosintesis terjadi di daun menggunakan klorofil dan sinar matahari.'),
  makeMCQ('Organ tubuh manusia yang berfungsi untuk memompa darah adalah...', 'Jantung', ['Paru-paru', 'Lambung', 'Hati'], 'Jantung memompa darah ke seluruh tubuh.'),
  makeMCQ('Organ pernapasan manusia adalah...', 'Paru-paru', ['Jantung', 'Ginjal', 'Hati'], 'Paru-paru digunakan untuk bernapas, menyerap oksigen.'),
  makeMCQ('Urutan siklus air yang benar adalah...', 'Penguapan → Kondensasi → Presipitasi', ['Presipitasi → Kondensasi → Penguapan', 'Kondensasi → Penguapan → Presipitasi', 'Penguapan → Presipitasi → Kondensasi'], 'Air menguap karena panas, lalu menjadi awan (kondensasi), lalu turun hujan (presipitasi).'),
  makeMCQ('Apa yang dimaksud dengan "presipitasi" dalam siklus air?', 'Turunnya hujan atau salju', ['Penguapan air', 'Pembentukan awan', 'Air meresap ke tanah'], 'Presipitasi adalah proses turunnya air dari awan ke bumi sebagai hujan, salju, atau salju.'),
  makeMCQ('Hewan yang mengalami metamorfosis sempurna adalah...', 'Kupu-kupu', ['Belalang', 'Kecoa', 'Jangkrik'], 'Kupu-kupu: telur → ulat → kepompong → kupu-kupu (metamorfosis sempurna).'),
  makeMCQ('Bagian tumbuhan yang merupakan alat perkembangbiakan adalah...', 'Bunga', ['Daun', 'Batang', 'Akar'], 'Bunga adalah alat perkembangbiakan tumbuhan.'),
  makeMCQ('Hewan pemakan daging disebut...', 'Karnivora', ['Herbivora', 'Omnivora', 'Insektivora'], 'Karnivora = pemakan daging. Herbivora = pemakan tumbuhan. Omnivora = pemakan keduanya.'),
  makeMCQ('Planet tempat kita tinggal bernama...', 'Bumi', ['Mars', 'Venus', 'Jupiter'], 'Kita tinggal di planet Bumi, planet ketiga dari Matahari.'),
];

function generateIPAQuestions() {
  return shuffle(ipaPool).slice(0, 10);
}

// ----- IPS -----
const ipsPool = [
  makeMCQ('Ibu kota negara Indonesia adalah...', 'Jakarta', ['Bandung', 'Surabaya', 'Yogyakarta'], 'Jakarta adalah ibu kota Indonesia. (Catatan: ibu kota akan dipindah ke Nusantara.)'),
  makeMCQ('Lambang negara Indonesia adalah...', 'Garuda Pancasila', ['Singa', 'Harimau', 'Naga'], 'Lambang negara Indonesia adalah Garuda Pancasila dengan semboyan Bhinneka Tunggal Ika.'),
  makeMCQ('Semboyan negara Indonesia adalah...', 'Bhinneka Tunggal Ika', ['Merdeka atau Mati', 'Satu Nusa Satu Bangsa', 'Tanah Airku'], 'Bhinneka Tunggal Ika artinya "berbeda-beda tetapi tetap satu".'),
  makeMCQ('Provinsi yang terkenal dengan Tari Kecak adalah...', 'Bali', ['Jawa Tengah', 'Sumatera Barat', 'Kalimantan Barat'], 'Tari Kecak berasal dari Bali dan sering dipentaskan di Pura Uluwatu.'),
  makeMCQ('Profesi yang bertugas memadamkan api adalah...', 'Pemadam Kebakaran', ['Polisi', 'Dokter', 'Petani'], 'Pemadam kebakaran bertugas memadamkan kebakaran dan menyelamatkan korban.'),
  makeMCQ('Tari Saman berasal dari provinsi...', 'Aceh', ['Bali', 'Jawa Tengah', 'Papua'], 'Tari Saman berasal dari Aceh dan telah diakui UNESCO sebagai warisan budaya.'),
  makeMCQ('Batik telah diakui oleh UNESCO sebagai warisan budaya dari...', 'Indonesia', ['Malaysia', 'India', 'Thailand'], 'Batik Indonesia diakui UNESCO pada tahun 2009 sebagai Warisan Budaya Takbenda.'),
  makeMCQ('Alat musik Angklung berasal dari provinsi...', 'Jawa Barat', ['Bali', 'Aceh', 'Sulawesi Selatan'], 'Angklung adalah alat musik dari bambu yang berasal dari Jawa Barat.'),
  makeMCQ('Indonesia memiliki berapa provinsi saat ini?', '38', ['34', '32', '36'], 'Indonesia memiliki 38 provinsi setelah beberapa pemekaran terbaru.'),
  makeMCQ('Profesi yang bertugas mendidik dan mengajar siswa adalah...', 'Guru', ['Dokter', 'Polisi', 'Petani'], 'Guru adalah pahlawan tanpa tanda jasa yang bertugas mendidik generasi penerus bangsa.'),
  makeMCQ('Wayang Kulit adalah kesenian tradisional dari pulau...', 'Jawa', ['Sumatra', 'Kalimantan', 'Sulawesi'], 'Wayang Kulit berasal dari Jawa dan telah diakui UNESCO sebagai warisan dunia.'),
  makeMCQ('Provinsi manakah yang terletak di ujung barat Indonesia?', 'Aceh', ['Papua', 'Bali', 'Kalimantan Timur'], 'Aceh terletak di ujung barat Pulau Sumatra, merupakan provinsi paling barat Indonesia.'),
  makeMCQ('Hari Kemerdekaan Indonesia diperingati setiap tanggal...', '17 Agustus', ['17 Juli', '10 November', '20 Mei'], 'Indonesia merdeka pada tanggal 17 Agustus 1945.'),
  makeMCQ('Dokter bertugas untuk...', 'Merawat dan mengobati orang sakit', ['Menjaga keamanan', 'Memadamkan kebakaran', 'Mengajar siswa'], 'Dokter adalah tenaga medis yang bertugas merawat dan mengobati pasien.'),
];

function generateIPSQuestions() {
  return shuffle(ipsPool).slice(0, 10);
}
