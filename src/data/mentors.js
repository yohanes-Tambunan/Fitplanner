import { isDateInCurrentWeek } from '../utils/dateUtils';

// Pemilik projek: isi "name" dengan nama mentor yang sebenarnya, dan letakkan foto di public/mentors/.
// Kosong = tampil sebagai "Mentor Pemula Pria" dst. Semua kalimat di bawah adalah panduan tertulis,
// bukan klaim sertifikasi atau pengalaman seseorang.
export const mentors = [
  {
    id: 'pemula-pria', level: 'Pemula', gender: 'Laki-laki', genderLabel: 'Pria',
    role: 'WowokTzy', name: '', photo: '/mentors/pemula-pria.png',
    intro: 'Perkenalkan saya wowoktzy, saya akan membuat badan kamu bagus seperti bagusnya tipu muslihat saya eh bagusnya badan saya maksudnya, panggil saja wokgans',
  },
  {
    id: 'pemula-wanita', level: 'Pemula', gender: 'Perempuan', genderLabel: 'Wanita',
    role: 'Megachan', name: '', photo: '/mentors/pemula-wanita.png',
    intro: 'Dalam mendapatkan badan yang bagus bukan hanya soal latihan yang baik, tetapi mendapatkan mentor seperti bapak saya agar dapat jadi presiden eh maksudnya mendapatkan mentor yang cocok seperti saya, panggil saja megachantwik ',
  },
  {
    id: 'menengah-pria', level: 'Menengah', gender: 'Laki-laki', genderLabel: 'Pria',
    role: 'Syahronislay', name: '', photo: '/mentors/menengah-pria.png',
    intro: 'Tidak perlu seperti saya untuk mendapatkan lakilaki gantengs eh untuk mendapatkan badan yang ganteng, tetapi dengan latihan yang teratur kamu dapat menjadi salah satu laki laki ganteng saya, panggil saja mas sharoni',
  },
  {
    id: 'menengah-wanita', level: 'Menengah', gender: 'Perempuan', genderLabel: 'Wanita',
    role: 'Ijodingin', name: '', photo: '/mentors/menengah-wanita.png',
    intro: 'Dalam mengangkat suatu alat gym, bukan hanya kekuatan yang diperlukan, tetapi juga tentang ketenangan dalam mendapatkan timing yang pas seperti saya, panggil saja tante ijo',
  },
];

export function getMentorName(mentor) {
  return mentor.name || `${mentor.role} ${mentor.genderLabel}`;
}

// Sumber ide: ACE (gymtimidation), PureGym (sesi pertama 20 menit), ScienceAlert (jam sepi),
// artikel progressive overload, RIR/RPE, dan deload dari Barbell Medicine, Breaking Muscle, HubFit.
export const levelGuidance = {
  Pemula: {
    focus: [
      { title: 'Pemula', body: 'Baik bertanya agar tidak sesat dijalan, kata kata ini harus kamu terapkan di gym agar kamu bisa menjadi ksatria yang hebat, tidak perlu malu'},
      { title: 'Singkat tapi terencana', body: 'Tidak perlu untuk melatih diri kamu dengan intensitas yang banyak, kamu hanya perlu konsisten dalam melewati setiap rencana latihan' },
      { title: 'Pentingnya mengatur teknik', body: 'Kamu tidak boleh menaikkan beban kamu terlalu berat sebelum kamu benar benar memahami teknik disetiap jenis olahraganya' },
      { title: 'Rekomendasi waktu gym', body: 'Rekomendasi aku untuk kamu adalah kamu latihan disaat semua orang tidak latihan. Bukan untuk membuat kamu tidak percaya diri, tetapi agar kamu fokus terhadap latihan kamu' },
    ],
    states: {
      idle: 'Minggu ini belum ada sesi yang tercatat. Ayo latihanlah! ingat mereka yang sedang memperjelekan badan kamu',
      progress: 'Ayo terus berusaha dalam berproses, aku bangga padamu!',
      done: 'Target minggu ini tercapai, well done! semangat untuk minggu selanjutnya dan berikan waktu untuk badan dan diri kamu istirahat',
    },
    replies: {
      ringan: 'Setelah 12 kali sudah terasa enteng bagi kamu, kamu perlu menambahkan beban untuk menaikkan ritme latihan kamu',
      pas: 'Jika masih stagnan, tidak apa apa. Latihan kamu tetap seperti sebelumnya',
      berat: 'Aku sarankan kamu lebih banyak tidur dan mengatur pola makan kamu dengan lebih banyak memakan protein seperti ayam dan lain sebagainya, Jangan patah semangat ya!',
    },
  },
  Menengah: {
    focus: [
      { title: 'Tambah repetisi', body: 'Tambah satu repetisi pada beban yang sama sebelum menambah beban' },
      { title: 'Catat semua repetisi', body: 'Catatlah dengan baik berapa repetisi yang berhasil kamu dapatkan' },
      { title: 'Habiskan tenaga disetiap repetisi', body: 'Dalam membentuk otot, bukan hanya kekuatan yang kamu pikirkan, tetapi juga mental kamu' },
      { title: 'Terasa berat', body: 'Turunin repetisi menjadi repetisi sebelumnya bila kamu merasa tidak kuat saat mengangkat beban yang sudah kamu tingkatkan repetisinya' },
    ],
    states: {
      idle: 'Jangan merasa selama ini latihan kamu tidak ada peningkatan, karena kamu sudah mau latihan aja itu salah satu peningkatan di diri kamu',
      progress: 'Teruslah berusaha, aku bangga padamu!',
      done: 'Target minggu ini sudah tercapai, selamat!',
    },
    replies: {
      ringan: 'Cobalah menaikkan beban dengan repetisi yang sama, itu membuat proggres kamu berguna',
      pas: 'Beban sudah tepat. Cobalah untuk menaikkan repetisinya',
      berat: 'Kalau terasa berat tiga sesi berturut-turut, aku rasa kamu ga ngejaga pola istirahat dan makanan kamu, tidurlah yang cukup jangan kurang tidur untuk hal yang tidak berguna',
    },
  },
};

export const feelOptions = [
  { value: 'ringan', label: 'Ringan', detail: 'Mengangkat beban sudah seperti mengangkat pensil' },
  { value: 'pas', label: 'Pas', detail: '12 kali masih tidak ringan' },
  { value: 'berat', label: 'Berat', detail: 'Mengangkat beban sudah seperti mengangkat dosa' },
];

export function getMentorFor(profile = {}) {
  const sameLevel = mentors.filter((mentor) => mentor.level === profile.experience);
  if (!sameLevel.length) return null;
  return sameLevel.find((mentor) => mentor.gender === profile.gender) || sameLevel[0];
}

export function getMentorState(history, goals) {
  const done = history.filter((item) => isDateInCurrentWeek(item.date)).length;
  const target = Math.max(1, Number(goals.weeklyWorkoutTarget) || 1);
  if (done >= target) return { key: 'done', done, target };
  return { key: done > 0 ? 'progress' : 'idle', done, target };
}