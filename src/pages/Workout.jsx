import { useEffect, useMemo, useState } from 'react';
import { Dumbbell, HeartPulse, ListFilter, Plus, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import WorkoutCard from '../components/WorkoutCard';
import { useGym } from '../context/GymContext';
import { EXERCISES } from '../data/exercises';
import { getFocusCopy, getWeeklyPlan } from '../utils/personalization';

const emptyForm = {
  name: '',
  focus: '',
  duration: '45',
  level: 'Pemula',
  description: '',
  exerciseIds: [],
};

function WorkoutForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => initial
    ? { ...emptyForm, ...initial, exerciseIds: initial.exerciseIds || [] }
    : emptyForm);
  const [error, setError] = useState('');

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  function toggleExercise(exerciseId) {
    setForm((current) => ({
      ...current,
      exerciseIds: current.exerciseIds.includes(exerciseId)
        ? current.exerciseIds.filter((id) => id !== exerciseId)
        : [...current.exerciseIds, exerciseId],
    }));
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.focus.trim()) {
      setError('Nama program dan fokus latihan perlu diisi.');
      return;
    }
    if (!form.exerciseIds.length) {
      setError('Pilih setidaknya satu gerakan untuk program ini.');
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      focus: form.focus.trim(),
      duration: Math.min(300, Math.max(1, Number(form.duration) || 45)),
      exerciseIds: form.exerciseIds,
      isStarter: Boolean(initial?.isStarter),
    });
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <label className="form-field">
        Nama program
        <input autoFocus name="name" value={form.name} onChange={handleChange} placeholder="Contoh: Upper Body" maxLength={40} required />
      </label>
      <label className="form-field">
        Fokus otot
        <input name="focus" value={form.focus} onChange={handleChange} placeholder="Contoh: Dada, punggung, dan lengan" maxLength={80} required />
      </label>
      <div className="form-row">
        <label className="form-field">
          Durasi (menit)
          <input name="duration" type="number" min="1" max="300" value={form.duration} onChange={handleChange} required />
        </label>
        <label className="form-field">
          Tingkat latihan
          <select name="level" value={form.level} onChange={handleChange}>
            <option>Pemula</option>
            <option>Menengah</option>
            <option>Berpengalaman</option>
          </select>
        </label>
      </div>
      <label className="form-field">
        Catatan program
        <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Catatan singkat (opsional)." maxLength={220} />
      </label>

      <fieldset className="form-field exercise-picker">
        <legend>Gerakan dalam program</legend>
        <p className="field-hint">Pilih gerakan yang ingin kamu masukkan. Kamu bisa melihat video dan petunjuknya di Exercise Library.</p>
        <div className="exercise-picker-list">
          {EXERCISES.map((exercise) => (
            <label className="exercise-picker-option" key={exercise.id}>
              <input
                type="checkbox"
                checked={form.exerciseIds.includes(exercise.id)}
                onChange={() => toggleExercise(exercise.id)}
              />
              <span>
                <strong>{exercise.name}</strong>
                <small>{exercise.muscle} · {exercise.equipment}</small>
              </span>
            </label>
          ))}
        </div>
        <span className="field-hint">{form.exerciseIds.length} gerakan dipilih</span>
      </fieldset>

      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="modal-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>Batal</button>
        <button className="button button-primary" type="submit">Simpan program</button>
      </div>
    </form>
  );
}

function WeeklyRecommendation({ profile, onExplore }) {
  const plan = getWeeklyPlan(profile);
  const focusCopy = getFocusCopy(profile);

  return (
    <section className="recommended-program panel" aria-labelledby="recommendation-title">
      <div className="recommended-heading">
        <div>
          <p className="eyebrow">BERDASARKAN PROFILMU</p>
          <h3 id="recommendation-title">Rencana latihan yang disarankan</h3>
          <p>{focusCopy.body}</p>
        </div>
      </div>
      <div className="recommended-day-grid">
        {plan.map((day) => {
          const exercises = day.exerciseIds
            .map((id) => EXERCISES.find((item) => item.id === id))
            .filter(Boolean)
            .slice(0, 4);
          return (
            <article className={`recommended-day ${day.kind === 'cardio' ? 'recommended-day-cardio' : ''}`} key={day.day}>
              <div className="recommended-day-top"><span>{day.day}</span><small>{day.duration}</small></div>
              <h4>{day.title}</h4>
              <p>{day.note}</p>
              <div className="recommended-exercise-list">
                {exercises.map((exercise) => <span key={exercise.id}>{exercise.name}</span>)}
              </div>
              <button
                type="button"
                className="text-action"
                onClick={() => onExplore(exercises[0]?.id)}
                disabled={!exercises.length}
              >
                Lihat gerakan
              </button>
            </article>
          );
        })}
      </div>
      <div className="recommended-footnote">
        <HeartPulse size={15} aria-hidden="true" />
        <span>Rencana awal mengikuti level {profile.experience || 'Pemula'} dan ketersediaan {profile.weeklyFrequency || 3} hari per minggu. Sisakan waktu pemulihan dan sesuaikan gerakan dengan kemampuanmu.</span>
      </div>
    </section>
  );
}

export default function Workout() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, profile } = useGym();
  const navigate = useNavigate();
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [search, setSearch] = useState('');
  const [leavingId, setLeavingId] = useState(null);

  useEffect(() => {
    if (!location.state?.openCreate) return;
    setEditingWorkout(null);
    setShowForm(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.key, location.pathname, location.state, navigate]);

  const filtered = useMemo(() => workouts.filter((item) => (
    `${item.name} ${item.focus}`.toLowerCase().includes(search.toLowerCase())
  )), [workouts, search]);

  function handleSave(input) {
    if (editingWorkout) updateWorkout(editingWorkout.id, input);
    else addWorkout(input);
    setShowForm(false);
    setEditingWorkout(null);
  }

  function handleDelete(id) {
    const selected = workouts.find((item) => item.id === id);
    if (selected && window.confirm(`Hapus program "${selected.name}"? Jadwal yang sudah dibuat tetap tersimpan.`)) {
      setLeavingId(id);
      window.setTimeout(() => {
        deleteWorkout(id);
        setLeavingId(null);
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220);
    }
  }

  function handlePlan(workout) {
    navigate('/schedule', { state: { workoutId: workout.id } });
  }

  function exploreExercise(exerciseId) {
    if (!exerciseId) return;
    navigate('/exercises', { state: { exerciseId } });
  }

  return (
    <div className="page-stack">
      <section className="page-intro-row">
        <div>
          <p className="eyebrow">SUSUN RUTINITASMU</p>
          <h2>Program latihan</h2>
          <p className="page-description">Lihat saran latihan berdasarkan profil, lalu buat program yang ingin kamu jalankan.</p>
        </div>
        <button className="button button-primary" type="button" onClick={() => { setEditingWorkout(null); setShowForm(true); }}>
          <Plus size={17} aria-hidden="true" /> Buat program
        </button>
      </section>

      <WeeklyRecommendation profile={profile} onExplore={exploreExercise} />

      <section className="workout-toolbar panel panel-toolbar">
        <div className="toolbar-title">
          <Dumbbell size={18} aria-hidden="true" />
          <span><strong>{workouts.length} program</strong><small>Contoh program dan program yang kamu buat</small></span>
        </div>
        <label className="search-field">
          <Search size={16} aria-hidden="true" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari program latihan..." aria-label="Cari program latihan" />
        </label>
      </section>

      {filtered.length ? (
        <section className="workout-grid" aria-label="Daftar program latihan">
          {filtered.map((workout) => {
            const exerciseNames = (workout.exerciseIds || [])
              .map((id) => EXERCISES.find((exercise) => exercise.id === id)?.name)
              .filter(Boolean);
            return (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                exerciseNames={exerciseNames}
                leaving={leavingId === workout.id}
                onEdit={(selected) => { setEditingWorkout(selected); setShowForm(true); }}
                onDelete={handleDelete}
                onPlan={handlePlan}
              />
            );
          })}
        </section>
      ) : (
        <div className="panel empty-state">
          <ListFilter size={25} aria-hidden="true" />
          <strong>{search ? 'Program tidak ditemukan' : 'Belum ada program latihan'}</strong>
          <span>{search ? 'Coba kata kunci lain.' : 'Buat program latihan dan pilih gerakan yang ingin kamu lakukan.'}</span>
          {!search && <button className="button button-primary" onClick={() => setShowForm(true)} type="button"><Plus size={16} aria-hidden="true" /> Buat program</button>}
        </div>
      )}

      {showForm && (
        <Modal
          size="large"
          title={editingWorkout ? 'Edit program latihan' : 'Buat program latihan'}
          subtitle="Tentukan fokus, durasi, dan gerakan yang akan kamu lakukan."
          onClose={() => { setShowForm(false); setEditingWorkout(null); }}
        >
          <WorkoutForm
            initial={editingWorkout || undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingWorkout(null); }}
          />
        </Modal>
      )}
    </div>
  );
}
