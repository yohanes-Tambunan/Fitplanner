import PropTypes from 'prop-types';
import ExerciseMedia from './ExerciseMedia';

export default function ExerciseCard({ exercise, onSelect }) {
  const unit = exercise.type === 'cardio' ? 'sesi' : 'set';
  return (
    <button className="exercise-card" type="button" onClick={() => onSelect(exercise)} aria-label={`Buka detail ${exercise.name}`}>
      <ExerciseMedia exercise={exercise} />
      <div className="exercise-card-content">
        <h3>{exercise.name}</h3>
        <p>{exercise.equipment}</p>
        <div className="exercise-card-tags">
          <span>{exercise.sets} {unit}</span>
          <span>{exercise.type === 'cardio' ? exercise.reps : `${exercise.reps} repetisi`}</span>
          {exercise.isRecommended && <span className="exercise-recommended-tag">Pilihan untukmu</span>}
        </div>
      </div>
    </button>
  );
}

ExerciseCard.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    muscle: PropTypes.string.isRequired,
    equipment: PropTypes.string.isRequired,
    type: PropTypes.string,
    sets: PropTypes.number.isRequired,
    reps: PropTypes.string.isRequired,
    isRecommended: PropTypes.bool,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};
