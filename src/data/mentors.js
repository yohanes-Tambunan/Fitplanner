import { isDateInCurrentWeek } from '../utils/dateUtils';

// Pemilik projek: isi "name" dengan nama mentor yang sebenarnya, dan letakkan foto di public/mentors/.
// Kosong = tampil sebagai "Mentor Pemula Pria" dst. Semua kalimat di bawah adalah panduan tertulis,
// bukan klaim sertifikasi atau pengalaman seseorang.
export const mentors = [
  {
    id: 'pemula-pria', level: 'Pemula', gender: 'Laki-laki', genderLabel: 'Pria',
    role: 'Mentor Pemula', name: '', photo: '/mentors/pemula-pria.png',
    intro: 'Semua orang pernah canggung di hari pertama gym. Aku akan menemani langkah awalmu: pendek, terencana, dan tidak terburu-buru.',
  },
  {
    id: 'pemula-wanita', level: 'Pemula', gender: 'Perempuan', genderLabel: 'Wanita',
    role: 'Mentor Pemula', name: '', photo: '/mentors/pemula-wanita.png',
    intro: 'Tidak ada yang menuntutmu langsung jago. Kita mulai dari rencana kecil yang bisa kamu ulang minggu depan, lalu naik pelan-pelan.',
  },
  {
    id: 'menengah-pria', level: 'Menengah', gender: 'Laki-laki', genderLabel: 'Pria',
    role: 'Mentor Menengah', name: '', photo: '/mentors/menengah-pria.png',
    intro: 'Kamu sudah melewati tahap kenalan. Sekarang yang menentukan adalah catatan yang rapi dan kenaikan beban yang sabar.',
  },
  {
    id: 'menengah-wanita', level: 'Menengah', gender: 'Perempuan', genderLabel: 'Wanita',
    role: 'Mentor Menengah', name: '', photo: '/mentors/menengah-wanita.png',
    intro: 'Di level ini kemajuan terasa lebih lambat, dan itu normal. Aku bantu kamu membaca catatan latihan supaya tahu kapan harus menambah dan kapan harus menahan.',
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
      { title: 'Kenali gym lebih dulu', body: 'Minta orientasi alat ke staf gym di hari pertama. Tahu letak dan cara pakai alat mengurangi rasa canggung.' },
      { title: 'Mulai pendek dan terencana', body: 'Pilih dua sampai tiga gerakan sebelum datang. Sesi sekitar 20 menit sudah cukup untuk minggu pertama.' },
      { title: 'Teknik dulu, beban belakangan', body: 'Pakai beban yang bisa kamu kontrol di seluruh gerakan. Naikkan beban setelah gerakan terasa stabil.' },
      { title: 'Datang saat gym sepi', body: 'Jam sepi memberi ruang untuk belajar alat tanpa merasa diperhatikan. Ajak teman bila ada.' },
    ],
    states: {
      idle: 'Minggu ini belum ada sesi yang tercatat. Tidak apa-apa. Pilih satu program dari Workout Plan, jadwalkan sesi pendek, lalu datang saja.',
      progress: 'Kamu sudah mulai dan itu bagian tersulit. Ulangi pola yang sama di sesi berikutnya sebelum menambah apa pun.',
      done: 'Target minggu ini tercapai. Istirahat juga bagian dari program, jadi beri tubuhmu waktu pulih.',
    },
    replies: {
      ringan: 'Terasa ringan berarti bebanmu masih nyaman. Pertahankan teknik, lalu tambah satu repetisi atau sedikit beban di sesi berikutnya.',
      pas: 'Tingkat kesulitan yang pas. Ulangi minggu ini dengan pola yang sama sampai gerakan terasa otomatis.',
      berat: 'Terasa berat, jadi kurangi beban atau jumlah set di sesi berikutnya. Kalau ada nyeri, hentikan latihan dan tanyakan ke instruktur.',
    },
  },
  Menengah: {
    focus: [
      { title: 'Naik lewat repetisi dulu', body: 'Tambah satu repetisi pada beban yang sama sebelum menambah beban. Satu repetisi ekstra juga kemajuan.' },
      { title: 'Catat beban dan repetisi', body: 'Plateau baru bisa dipastikan dari catatan empat sampai enam minggu. Tanpa catatan, kita hanya menebak.' },
      { title: 'Sisakan 1 sampai 2 repetisi', body: 'Hentikan set saat masih ada tenaga untuk satu atau dua repetisi lagi. Teknik tetap terjaga dan pemulihan lebih mudah.' },
      { title: 'Jadwalkan minggu ringan', body: 'Bila performa turun beberapa sesi berturut-turut, kurangi volume sekitar sepertiga sampai setengah selama satu minggu.' },
    ],
    states: {
      idle: 'Belum ada sesi tercatat minggu ini. Tentukan hari dan program sekarang, supaya catatan minggu ini tidak kosong.',
      progress: 'Sesi berjalan. Bandingkan beban dan repetisi hari ini dengan sesi terakhir untuk gerakan yang sama, lalu putuskan: tambah, tahan, atau turunkan.',
      done: 'Target minggu ini tercapai. Gunakan sisa minggu untuk tidur cukup dan makan teratur, karena di sanalah otot beradaptasi.',
    },
    replies: {
      ringan: 'Terlalu ringan untuk level menengah. Tambah satu repetisi di tiap set, atau naikkan beban sedikit bila rentang repetisi sudah tercapai.',
      pas: 'Beban sudah tepat. Pertahankan, catat hasilnya, dan cari tambahan satu repetisi di sesi berikutnya.',
      berat: 'Kalau terasa berat tiga sesi berturut-turut, cek tidur dan asupan makan dulu. Setelah itu pertimbangkan minggu ringan dengan volume dikurangi.',
    },
  },
};

export const feelOptions = [
  { value: 'ringan', label: 'Ringan', detail: 'Masih banyak tenaga tersisa' },
  { value: 'pas', label: 'Pas', detail: 'Menantang tapi terkendali' },
  { value: 'berat', label: 'Berat', detail: 'Hampir tidak sanggup menyelesaikan' },
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
