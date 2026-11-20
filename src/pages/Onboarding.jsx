import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowLeft, ArrowRight, Check, HeartPulse, UserRound, Weight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import Logo from '../components/Logo';
import MentorPhoto from '../components/MentorPhoto';
import { getMentorFor, getMentorName } from '../data/mentors';
import { calculateBMI, getBMICategory, getFocusCopy, getWeeklyPlan } from '../utils/personalization';

const initialForm = {
  name: '',
  gender: '',
  age: '',
  weight: '',
  height: '',
  experience: '',
  weeklyFrequency: '3',
};

const levels = [
  { value: 'Pemula', title: 'Pemula', detail: 'Baru mulai atau belum rutin latihan', number: '01' },
  { value: 'Menengah', title: 'Menengah', detail: 'Sudah mengenal teknik dasar dan mulai konsisten', number: '02' },
  { value: 'Berpengalaman', title: 'Berpengalaman', detail: 'Rutin latihan dan memahami progres bertahap', number: '03' },
];

function Field({ label, children, hint }) {
  return (
    <label className="onboard-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function ChoiceField({ label, children, hint }) {
  return (
    <fieldset className="onboard-field onboard-choice-field">
      <legend>{label}</legend>
      {children}
      {hint && <small>{hint}</small>}
    </fieldset>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile, updateGoals } = useGym();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...initialForm, ...profile, weeklyFrequency: String(profile.weeklyFrequency || 3) });
  const [error, setError] = useState('');
  const headingRef = useRef(null);

  const bmi = useMemo(() => calculateBMI(form.weight, form.height), [form.weight, form.height]);
  const bmiInfo = useMemo(() => getBMICategory(bmi, form.age), [bmi, form.age]);
  const focusCopy = getFocusCopy({ bmiCategory: bmiInfo.key });
  const weekPlan = getWeeklyPlan({
    experience: form.experience || 'Pemula',
    weeklyFrequency: form.weeklyFrequency,
    bmiCategory: bmiInfo.key,
  });

  const summaryMentor = getMentorFor({ experience: form.experience, gender: form.gender });

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  function selectValue(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  }

  function goNext() {
    if (step === 1) {
      const age = Number(form.age);
      if (!form.name.trim() || !form.gender || !Number.isFinite(age) || age < 13 || age > 100) {
        setError('Isi nama, gender, dan usia antara 13 sampai 100 tahun.');
        return;
      }
    }

    if (step === 2) {
      const weight = Number(form.weight);
      const height = Number(form.height);
      if (!form.weight || !form.height || weight < 20 || weight > 300 || height < 100 || height > 250) {
        setError('Masukkan berat 20 sampai 300 kg dan tinggi 100 sampai 250 cm.');
        return;
      }
    }

    if (step === 3 && !form.experience) {
      setError('Pilih tingkat pengalaman gym terlebih dahulu.');
      return;
    }

    setError('');
    setStep((current) => Math.min(4, current + 1));
  }

  function finish() {
    const numericBMI = calculateBMI(form.weight, form.height);
    const category = getBMICategory(numericBMI, form.age);

    updateProfile({
      name: form.name.trim(),
      gender: form.gender,
      age: Number(form.age),
      height: Number(form.height),
      weight: Number(form.weight),
      bmi: numericBMI,
      bmiCategory: category.key,
      experience: form.experience,
      weeklyFrequency: Number(form.weeklyFrequency),
      fitnessGoal: category.key === 'underweight'
        ? 'Meningkatkan massa otot'
        : category.key === 'overweight' || category.key === 'obesity'
          ? 'Meningkatkan kebugaran dan kardio'
          : 'Kebugaran seimbang',
      onboardingComplete: true,
      joinedAt: profile.joinedAt || new Date().toISOString(),
    });
    updateGoals({ weeklyWorkoutTarget: Number(form.weeklyFrequency) });
    navigate('/exercises', { replace: true });
  }

  return (
    <main className="onboarding-shell">
      <aside className="onboarding-aside">
        <div className="onboarding-brand"><Logo variant="aside" /></div>
        <div className="onboarding-aside-copy">
          <p className="onboarding-kicker">Mulai dari kebutuhanmu</p>
          <h1>Susun rutinitas<br />yang <em>cocok untukmu.</em></h1>
          <p>Kenali profil tubuhmu, pilih ritme latihan, lalu mulai dengan rencana yang realistis.</p>
        </div>
      </aside>

      <section className="onboarding-main" aria-label="Pengaturan profil latihan">
        <div className="onboarding-topline"><span>BUAT PROFIL LATIHAN</span><span>LANGKAH {step} DARI 4</span></div>
        <div className="onboarding-progress" role="progressbar" aria-label="Langkah onboarding" aria-valuemin="1" aria-valuemax="4" aria-valuenow={step}>
          <span style={{ width: `${step * 25}%` }} />
        </div>

        {step === 1 && (
          <div className="onboarding-content">
            <div className="onboarding-heading">
              <span className="onboard-icon"><UserRound size={20} aria-hidden="true" /></span>
              <p className="eyebrow">01 / PROFIL DASAR</p>
              <h2 ref={headingRef} tabIndex={-1}>Kenalan dulu, yuk.</h2>
              <p>Isi nama, usia, dan gender untuk membuat profil latihan.</p>
            </div>
            <div className="onboard-form-grid">
              <Field label="Nama lengkap">
                <input name="name" value={form.name} onChange={change} placeholder="Nama yang ingin ditampilkan" maxLength="50" required />
              </Field>
              <Field label="Usia" hint="Usia diperlukan untuk membaca hasil BMI dengan tepat.">
                <input name="age" type="number" min="13" max="100" value={form.age} onChange={change} placeholder="Contoh: 21" required />
              </Field>
            </div>
            <ChoiceField label="Gender">
              <div className="onboard-choice-grid three-choice" role="group" aria-label="Pilih gender">
                {[
                  ['Laki-laki', 'Pria'],
                  ['Perempuan', 'Wanita'],
                  ['Memilih tidak menjawab', 'Tidak ingin menjawab'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`onboard-choice ${form.gender === value ? 'selected' : ''}`}
                    onClick={() => selectValue('gender', value)}
                    aria-pressed={form.gender === value}
                  >
                    <span className="choice-check">{form.gender === value ? <Check size={13} aria-hidden="true" /> : null}</span>
                    <strong>{label}</strong>
                  </button>
                ))}
              </div>
            </ChoiceField>
            <p className="onboard-helper">Gender dicatat pada profil. Jumlah set dan repetisi mengikuti pengalaman, tujuan, dan kemampuan latihan, bukan gender saja.</p>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-content">
            <div className="onboarding-heading">
              <span className="onboard-icon"><Weight size={20} aria-hidden="true" /></span>
              <p className="eyebrow">02 / DATA TUBUH</p>
              <h2 ref={headingRef} tabIndex={-1}>Kenali titik awalmu.</h2>
              <p>Masukkan tinggi dan berat badan untuk menghitung Body Mass Index (BMI).</p>
            </div>
            <div className="onboard-form-grid">
              <Field label="Berat badan" hint="Satuan kilogram (kg).">
                <div className="input-with-unit"><input name="weight" type="number" min="20" max="300" step="0.1" value={form.weight} onChange={change} placeholder="70" required /><span>kg</span></div>
              </Field>
              <Field label="Tinggi badan" hint="Satuan sentimeter (cm).">
                <div className="input-with-unit"><input name="height" type="number" min="100" max="250" step="0.1" value={form.height} onChange={change} placeholder="170" required /><span>cm</span></div>
              </Field>
            </div>
            <div className="bmi-preview" aria-live="polite">
              <div className="bmi-preview-head"><span><Activity size={17} aria-hidden="true" /> BMI CALCULATOR</span><small>Berat ÷ tinggi²</small></div>
              <div className="bmi-number-row"><strong>{bmi == null ? '-' : bmi.toFixed(1)}</strong><span>{bmi == null ? 'Masukkan data tubuhmu' : bmiInfo.label}</span></div>
              {bmi != null && <p>{bmiInfo.description}</p>}
              {bmi != null && bmiInfo.key !== 'youth' && (
                <>
                  <div className="bmi-scale" aria-hidden="true"><i className="under" /><i className="normal" /><i className="over" /><i className="obese" /></div>
                  <div className="bmi-scale-labels"><span>Kurang</span><span>Sehat</span><span>Berlebih</span><span>Obesitas</span></div>
                </>
              )}
            </div>
            <p className="onboard-helper">BMI adalah alat skrining, bukan diagnosis. Untuk usia di bawah 20 tahun, penilaian membutuhkan persentil berdasarkan usia dan gender. FitPlanner tidak memberi label kategori BMI dewasa untuk kelompok usia tersebut.</p>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-content">
            <div className="onboarding-heading">
              <span className="onboard-icon"><Zap size={20} aria-hidden="true" /></span>
              <p className="eyebrow">03 / KEBIASAAN LATIHAN</p>
              <h2 ref={headingRef} tabIndex={-1}>Atur ritme latihanmu.</h2>
              <p>Pengalaman dan jumlah hari latihan membantu menentukan dosis awal dan pembagian sesi.</p>
            </div>
            <ChoiceField label="Seberapa berpengalaman kamu di gym?">
              <div className="onboard-level-list" role="group" aria-label="Pilih pengalaman gym">
                {levels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    className={`onboard-level ${form.experience === level.value ? 'selected' : ''}`}
                    onClick={() => selectValue('experience', level.value)}
                    aria-pressed={form.experience === level.value}
                  >
                    <span className="level-number">{level.number}</span>
                    <span className="level-copy"><strong>{level.title}</strong><small>{level.detail}</small></span>
                    <span className="choice-check">{form.experience === level.value ? <Check size={13} aria-hidden="true" /> : null}</span>
                  </button>
                ))}
              </div>
            </ChoiceField>
            <ChoiceField label="Berapa kali seminggu kamu bisa ke gym?">
              <div className="frequency-grid" role="group" aria-label="Pilih frekuensi gym">
                {[1, 2, 3, 4, 5, 6].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`frequency-option ${Number(form.weeklyFrequency) === value ? 'selected' : ''}`}
                    onClick={() => selectValue('weeklyFrequency', String(value))}
                    aria-pressed={Number(form.weeklyFrequency) === value}
                  >
                    <strong>{value}</strong><span>hari</span>
                  </button>
                ))}
              </div>
            </ChoiceField>
            <p className="onboard-helper">Pilih jumlah hari yang realistis untuk rutinitasmu. Hari istirahat tetap bagian dari program latihan.</p>
          </div>
        )}

        {step === 4 && (
          <div className="onboarding-content">
            <div className="onboarding-heading">
              <span className="onboard-icon"><HeartPulse size={20} aria-hidden="true" /></span>
              <p className="eyebrow">04 / RINGKASAN PROFIL</p>
              <h2 ref={headingRef} tabIndex={-1}>Ini titik awalmu, {form.name.split(' ')[0]}.</h2>
              <p>Periksa kembali profil dan gambaran jadwal yang akan menjadi acuan awal.</p>
            </div>
            <div className="onboard-summary-grid">
              <div><small>BODY MASS INDEX</small><strong>{bmi?.toFixed(1) || '-'}</strong><span>{bmiInfo.label}</span></div>
              <div><small>PENGALAMAN</small><strong>{form.experience}</strong><span>{form.weeklyFrequency} hari per minggu</span></div>
            </div>
            <div className="onboard-recommendation">
              <span className="recommendation-icon"><Activity size={19} aria-hidden="true" /></span>
              <div><small>{focusCopy.tag}</small><strong>{focusCopy.title}</strong><p>{focusCopy.body}</p></div>
            </div>
            {summaryMentor && (
              <div className="onboard-mentor">
                <MentorPhoto mentor={summaryMentor} size="sm" />
                <div>
                  <small>MENTOR PENDAMPINGMU</small>
                  <strong>{getMentorName(summaryMentor)}</strong>
                  <p>{summaryMentor.intro}</p>
                </div>
              </div>
            )}
            <div className="onboard-week-preview">
              <div className="week-preview-heading"><strong>Rencana mingguan awal</strong><span>{weekPlan.length} hari latihan</span></div>
              {weekPlan.map((day) => (
                <div className="week-preview-row" key={day.day}><strong>{day.day}</strong><span>{day.title}</span><small>{day.duration}</small></div>
              ))}
            </div>
            <p className="onboard-helper">Rencana ini adalah titik awal umum. Sesuaikan beban dan durasi dengan kondisi tubuh. Hentikan latihan jika muncul nyeri atau gejala yang tidak biasa.</p>
          </div>
        )}

        {error && <div className="onboard-error" role="alert" aria-live="assertive">{error}</div>}
        <div className="onboarding-footer">
          {step > 1
            ? <button type="button" className="button button-secondary" onClick={() => { setError(''); setStep((current) => current - 1); }}><ArrowLeft size={16} aria-hidden="true" /> Kembali</button>
            : <span className="onboarding-secure">Data disimpan di browser perangkat ini.</span>}
          {step < 4
            ? <button type="button" className="button button-primary" onClick={goNext}>Lanjutkan <ArrowRight size={16} aria-hidden="true" /></button>
            : <button type="button" className="button button-primary" onClick={finish}>Masuk ke FitPlanner <ArrowRight size={16} aria-hidden="true" /></button>}
        </div>
      </section>
    </main>
  );
}
