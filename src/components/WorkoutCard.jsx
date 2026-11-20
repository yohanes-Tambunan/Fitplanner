import PropTypes from 'prop-types';
import { Clock3, Pencil, Trash2 } from 'lucide-react';

/*
  Kartu program tanpa ilustrasi dumbbell di bagian atas (dihapus: ornamen yang tidak membawa informasi).
  Tingkat latihan menjadi label teks di baris judul. `leaving` memicu animasi keluar sebelum kartu dihapus.
*/
export default function WorkoutCard({ workout, exerciseNames, onEdit, onDelete, onPlan, leaving }) {
  return (
    <article className={`workout-card ${leaving ? 'is-leaving' : ''}`}>
      <div className="workout-card-content">
        <div className="workout-card-heading">
          <div>
            <p className="eyebrow">{workout.isStarter ? 'Contoh program' : 'Program pribadi'} · {workout.level}</p>
            <h3>{workout.name}</h3>
          </div>
          <div className="card-actions">
            <button className="icon-button subtle-icon" type="button" onClick={() => onEdit(workout)} aria-label={`Edit ${workout.name}`} title="Edit program">
              <Pencil size={16} aria-hidden="true" />
            </button>
            <button className="icon-button subtle-icon danger-hover" type="button" onClick={() => onDelete(workout.id)} aria-label={`Hapus ${workout.name}`} title="Hapus program">
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
        <p className="workout-focus">{workout.focus}</p>
        {exerciseNames.length > 0 && (
          <ul className="workout-exercise-preview" aria-label="Gerakan dalam program">
            {exerciseNames.slice(0, 3).map((name) => <li key={name}>{name}</li>)}
            {exerciseNames.length > 3 && <li>+{exerciseNames.length - 3} gerakan lain</li>}
          </ul>
        )}
        <div className="workout-card-footer">
          <span className="meta-item"><Clock3 size={16} aria-hidden="true" /> {workout.duration} menit</span>
          <button className="text-button" type="button" onClick={() => onPlan(workout)}>Atur jadwal</button>
        </div>
      </div>
    </article>
  );
}

WorkoutCard.propTypes = {
  workout: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    focus: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    level: PropTypes.string.isRequired,
    isStarter: PropTypes.bool,
  }).isRequired,
  exerciseNames: PropTypes.arrayOf(PropTypes.string),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPlan: PropTypes.func.isRequired,
  leaving: PropTypes.bool,
};

WorkoutCard.defaultProps = {
  exerciseNames: [],
  leaving: false,
};
