'use strict';

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
  makeMCQ('Huruf manakah yang termasuk huruf VOKAL?', 'U', ['B', 'K', 'M'], 'Huruf vokal adalah A, I, U, E, O.'),
  makeMCQ('Huruf manakah yang termasuk huruf KONSONAN?', 'R', ['A', 'I', 'O'], 'Huruf konsonan adalah semua huruf selain A, I, U, E, O.'),
  makeMCQ('Kalimat yang benar menurut EYD adalah...', 'Budi membaca buku di perpustakaan.', ['budi membaca buku di perpustakaan.', 'Budi membaca Buku di perpustakaan!', 'budi Membaca buku Di perpustakaan.'], 'Kalimat diawali huruf kapital dan diakhiri tanda titik.'),
  makeMCQ('Ejaan yang benar untuk kata "rumah sakit" adalah...', 'rumah sakit', ['rumahsakit', 'Rumahsakit', 'RUMAH SAKIT'], '"Rumah sakit" ditulis dua kata dan huruf kecil (kecuali di awal kalimat).'),
  makeMCQ('Lengkapi kalimat: "Ayah pergi ke _____ untuk membeli sayur."', 'pasar', ['perpustakaan', 'sekolah', 'rumah sakit'], 'Sayur dibeli di pasar.'),
  makeMCQ('Kata yang memiliki huruf vokal pertama "I" adalah...', 'ikan', ['buku', 'meja', 'kursi'], 'I-kan dimulai dengan vokal "I".'),
  makeMCQ('Kalimat tanya yang benar adalah...', 'Di mana rumah kamu?', ['Di mana rumah kamu.', 'di mana rumah kamu?', 'Di mana Rumah kamu?'], 'Kalimat tanya diawali huruf kapital dan diakhiri tanda tanya.'),
  makeMCQ('Berapa jumlah huruf vokal dalam bahasa Indonesia?', '5', ['4', '6', '3'], 'Huruf vokal: A, I, U, E, O — ada 5 huruf.'),
  makeMCQ('Apa fungsi tanda titik (.) dalam kalimat?', 'Mengakhiri kalimat pernyataan', ['Mengakhiri kalimat tanya', 'Memisahkan kata', 'Memulai kalimat'], 'Tanda titik digunakan di akhir kalimat pernyataan.'),
  makeMCQ('Kata yang paling tepat untuk melengkapi: "Kucing itu ___ susu."', 'meminum', ['memakan', 'membaca', 'berlari'], '"Meminum" sesuai karena susu adalah minuman.'),
  makeMCQ('Manakah penulisan nama kota yang benar?', 'Jakarta', ['jakarta', 'JAKARTA', 'jAKARTA'], 'Nama kota diawali huruf kapital.'),
  makeMCQ('Berapa jumlah huruf dalam alfabet Indonesia?', '26', ['24', '28', '25'], 'Alfabet Indonesia (Latin) terdiri dari 26 huruf.'),
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

function generateQuestions(subject) {
  switch (subject) {
    case 'math':   return generateMathQuestions();
    case 'bahasa': return generateBahasaQuestions();
    case 'ipa':    return generateIPAQuestions();
    case 'ips':    return generateIPSQuestions();
    default: return [];
  }
}
