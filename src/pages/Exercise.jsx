import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowUpRight, Search, ShieldCheck, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExerciseCard from '../components/ExerciseCard';
import ExerciseMedia from '../components/ExerciseMedia';
import Modal from '../components/Modal';
import { EXERCISES, MUSCLE_GROUPS } from '../data/exercises';
import { useGym } from '../context/GymContext';
import { getFocusCopy, getTrainingDose, getWeeklyPlan } from '../utils/personalization';

function ExerciseDetail({ exercise, dose }) {
  return (
    <div className="exercise-detail">
      <ExerciseMedia exercise={exercise} variant="detail" priority />
      <div className="exercise-detail-meta">
        <span className="filter-chip active">{exercise.muscle}</span>
        <span className="filter-chip">{exercise.equipment}</span>
        <span className="filter-chip">{exercise.type === 'cardio' ? 'Kardio' : 'Kekuatan'}</span>
      </div>
      <p className="exercise-detail-description">{exercise.description}</p>
      <div className="exercise-prescription" aria-label="Dosis latihan yang disarankan">
        <div><strong>{dose.sets}</strong><span>{exercise.type === 'cardio' ? 'Sesi' : 'Set'}</span></div>
        <div><strong>{dose.reps}</strong><span>{exercise.type === 'cardio' ? 'Durasi' : 'Repetisi'}</span></div>
        <div><strong>{dose.rest}</strong><span>Istirahat</span></div>
      </div>
      <div className="exercise-video-block">
        <div className="exercise-video-heading">
          <span><Activity size={16} aria-hidden="true" /> VIDEO DEMONSTRASI</span>
          <small>{exercise.videoSource}</small>
        </div>
        <div className="exercise-video-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${exercise.videoId}${exercise.videoStart ? `?start=${exercise.videoStart}` : ''}`}
            title={`Video demonstrasi ${exercise.name}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <a
          className="video-external-link"
          href={`https://www.youtube.com/watch?v=${exercise.videoId}${exercise.videoStart ? `&t=${exercise.videoStart}s` : ''}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Buka video di YouTube <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <h3>Langkah penggunaan</h3>
      <ol className="instruction-list">
        {exercise.instructions.map((step, index) => (
          <li key={`${exercise.id}-step-${index}`}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>
        ))}
      </ol>
      <p className="safety-note">
        <ShieldCheck size={15} aria-hidden="true" />
        Pilih beban yang masih bisa dikontrol. Minta bantuan instruktur untuk mengatur mesin atau mempelajari teknik baru, dan hentikan latihan jika terasa nyeri.
      </p>
    </div>
  );
}

export default function Exercise() {
  const { profile } = useGym();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('Semua');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const focusCopy = getFocusCopy(profile);
  const weeklyPlan = getWeeklyPlan(profile);
  const recommendedExerciseIds = new Set(weeklyPlan.flatMap((day) => day.exerciseIds));

  useEffect(() => {
    const requestedExercise = location.state?.exerciseId
      ? EXERCISES.find((exercise) => exercise.id === location.state.exerciseId)
      : null;

    if (requestedExercise) setSelectedExercise(requestedExercise);
    if (location.state?.focusSearch) searchInputRef.current?.focus();

    if (location.state?.exerciseId || location.state?.focusSearch) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.key, location.pathname, location.state, navigate]);

  const filtered = useMemo(() => EXERCISES.filter((exercise) => {
    const matchesGroup = activeGroup === 'Semua' || exercise.muscle === activeGroup;
    const matchesSearch = `${exercise.name} ${exercise.muscle} ${exercise.equipment}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesGroup && matchesSearch;
  }), [activeGroup, search]);

  return (
    <div className="page-stack">
      <section className="page-intro-row">
        <div>
          <p className="eyebrow">GERAKAN DAN TEKNIK</p>
          <h2>Daftar gerakan</h2>
          <p className="page-description">Cari gerakan, pelajari tekniknya lewat video, lalu gunakan dosis latihan sebagai titik awal.</p>
        </div>
        <div className="exercise-total"><Activity size={18} aria-hidden="true" /><strong>{EXERCISES.length}</strong><span>gerakan</span></div>
      </section>

      <section className="personal-plan-banner panel">
        <div className="personal-plan-copy">
          <span className="plan-tag">{focusCopy.tag}</span>
          <h3>{focusCopy.title}</h3>
          <p>{focusCopy.body}</p>
          <div className="personal-plan-meta">
            <span>{profile.experience || 'Pemula'}</span>
            <span>{profile.weeklyFrequency || 3} hari / minggu</span>
            <span>{profile.gender || 'Gender belum diisi'}</span>
          </div>
        </div>
      </section>

      <section className="weekly-plan-strip panel" aria-labelledby="weekly-plan-title">
        <div className="weekly-plan-title">
          <div><p className="eyebrow">GAMBARAN MINGGUAN</p><h3 id="weekly-plan-title">Rencana latihan mingguan</h3></div>
          <span>{weeklyPlan.length} hari latihan</span>
        </div>
        <div className="weekly-plan-days">
          {weeklyPlan.map((day) => (
            <article key={day.day} className={`weekly-plan-day ${day.kind === 'cardio' ? 'cardio-day' : ''}`}>
              <small>{day.day}</small><strong>{day.title}</strong><span>{day.duration}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="exercise-controls panel" aria-label="Pencarian dan filter latihan">
        <label className="search-field exercise-search">
          <Search size={17} aria-hidden="true" />
          <input
            ref={searchInputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari gerakan atau alat gym..."
            aria-label="Cari latihan"
          />
          {search && <button type="button" onClick={() => setSearch('')} aria-label="Hapus pencarian"><X size={15} /></button>}
        </label>
        <div className="filter-row" role="group" aria-label="Filter kelompok otot">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              type="button"
              className={`filter-chip ${activeGroup === group ? 'active' : ''}`}
              onClick={() => setActiveGroup(group)}
              aria-pressed={activeGroup === group}
            >
              {group}
            </button>
          ))}
        </div>
      </section>

      {filtered.length ? (
        <section className="exercise-grid" aria-label="Daftar gerakan">
          {filtered.map((exercise) => {
            const dose = getTrainingDose(profile, exercise);
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={{
                  ...exercise,
                  sets: dose.sets,
                  reps: dose.reps,
                  trainingLevel: profile.experience || 'Pemula',
                  isRecommended: recommendedExerciseIds.has(exercise.id),
                }}
                onSelect={() => setSelectedExercise(exercise)}
              />
            );
          })}
        </section>
      ) : (
        <div className="panel empty-state">
          <Search size={25} aria-hidden="true" />
          <strong>Gerakan tidak ditemukan</strong>
          <span>Ubah kata kunci atau pilih kelompok otot yang lain.</span>
          <button type="button" className="button button-secondary" onClick={() => { setSearch(''); setActiveGroup('Semua'); }}>Reset pencarian</button>
        </div>
      )}

      {selectedExercise && (
        <Modal
          title={selectedExercise.name}
          subtitle={`${selectedExercise.muscle} · ${selectedExercise.equipment}`}
          size="large"
          onClose={() => setSelectedExercise(null)}
        >
          <ExerciseDetail exercise={selectedExercise} dose={getTrainingDose(profile, selectedExercise)} />
        </Modal>
      )}
    </div>
  );
}
