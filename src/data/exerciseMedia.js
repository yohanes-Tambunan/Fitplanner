/*
  Foto per gerakan, diambil dari Wikimedia Commons (berkas berlisensi bebas).
  Alasan sumber ini: situs kesehatan komersial memegang hak cipta fotonya dan tidak boleh disalin;
  Commons mengizinkan pemakaian ulang dengan kredit. Setiap entri menyimpan nama berkas, pembuat foto,
  dan tautan ke halaman berkas yang memuat lisensi lengkapnya.

  kind:
  - 'photo'        foto orang yang sedang melakukan gerakan
  - 'photo-equip'  foto alat tanpa orang
  - 'illustration' ilustrasi anatomi, bagian otot target diberi warna
  focus: posisi crop (object-position) supaya bagian tubuh yang dilatih tetap terlihat di kartu.

  Mengganti dengan foto milik sendiri: taruh file di public/exercises/ lalu ganti `src` dengan
  '/exercises/nama-file.jpg' dan isi `author` serta `pageUrl` sesuai sumbernya.
*/
const COMMONS = 'https://commons.wikimedia.org/wiki/';

function commons(file, { author, kind = 'photo', focus = '50% 50%', alt }) {
  const underscored = file.replace(/ /g, '_');
  return {
    src: `${COMMONS}Special:FilePath/${encodeURIComponent(underscored)}?width=900`,
    pageUrl: `${COMMONS}File:${encodeURIComponent(underscored)}`,
    author,
    kind,
    focus,
    alt,
    source: 'Wikimedia Commons',
  };
}

export const EXERCISE_MEDIA = {
  'ex-treadmill': commons('Running-on-treadmills-motion-blur.jpg', {
    author: 'Brandon.wiggins', focus: '50% 70%',
    alt: 'Kaki beberapa orang berlari di treadmill dengan gerakan yang sedikit buram',
  }),
  'ex-elliptical': commons('Girl doing elliptical cardio exercise.jpg', {
    author: 'Tyler Read', focus: '50% 55%',
    alt: 'Seorang perempuan berlatih di mesin elliptical',
  }),
  'ex-rowing': commons('Rowing machine.jpg', {
    author: 'rrafson', kind: 'photo-equip', focus: '50% 60%',
    alt: 'Mesin rowing indoor',
  }),
  'ex-chest-press': commons('Girl doing chest press machine exercise.jpg', {
    author: 'Tyler Read', focus: '50% 40%',
    alt: 'Seorang perempuan mendorong beban pada mesin chest press, melatih otot dada',
  }),
  'ex-lat-pulldown': commons('Girl doing lat pulldown exercise.jpg', {
    author: 'Tyler Read', focus: '50% 40%',
    alt: 'Seorang perempuan menarik bar ke bawah pada mesin lat pulldown, melatih otot punggung',
  }),
  'ex-seated-row': commons('Woman using a seated cable row machine at the gym.jpg', {
    author: 'Miguel Angel Omaña Rojas', focus: '50% 45%',
    alt: 'Seorang perempuan menarik handle pada mesin seated cable row, melatih punggung tengah',
  }),
  'ex-leg-press': commons('Marian-Leg-Press.jpg', {
    author: 'Abooyeah', focus: '50% 60%',
    alt: 'Seorang atlet mendorong platform pada mesin leg press, melatih otot kaki',
  }),
  'ex-shoulder-press': commons('Health and fitness, military (shoulder) press.jpg', {
    author: 'GiftedLydia', focus: '50% 25%',
    alt: 'Seseorang menekan beban ke atas melewati bahu, melatih otot bahu',
  }),
  'ex-biceps-curl': commons("Close up of the woman's hands while she's doing bicep curls with dumbbells. (50425016047).jpg", {
    author: 'Nenad Stojkovic', focus: '50% 50%',
    alt: 'Dekat tangan seorang perempuan yang melakukan curl dengan dumbbell, melatih otot lengan',
  }),
  'ex-triceps-pushdown': commons('Triceps-pushdown-1.gif', {
    author: 'Everkinetic', kind: 'illustration', focus: '50% 35%',
    alt: 'Ilustrasi triceps pushdown dengan otot trisep yang diberi warna',
  }),
  'ex-squat': commons('Woman doing squat workout in gym with barbell.jpg', {
    author: 'Nenad Stojkovic', focus: '50% 55%',
    alt: 'Seorang perempuan melakukan squat dengan barbell, melatih paha dan glutes',
  }),
  'ex-rdl': commons('Romanian-deadlift-1.png', {
    author: 'Everkinetic', kind: 'illustration', focus: '50% 50%',
    alt: 'Ilustrasi Romanian deadlift dengan otot hamstring dan glutes yang diberi warna',
  }),
  'ex-plank': commons('Girl exercising doing a plank.jpg', {
    author: 'Tyler Read', focus: '50% 55%',
    alt: 'Seorang perempuan melakukan plank di atas matras, melatih otot inti',
  }),
};

export function getExerciseMedia(exerciseId) {
  return EXERCISE_MEDIA[exerciseId] || null;
}

export const MEDIA_KIND_LABEL = {
  photo: 'Foto',
  'photo-equip': 'Foto alat',
  illustration: 'Ilustrasi',
};
