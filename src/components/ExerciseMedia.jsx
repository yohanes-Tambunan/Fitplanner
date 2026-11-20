import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dumbbell, HeartPulse } from 'lucide-react';
import { getExerciseMedia, MEDIA_KIND_LABEL } from '../data/exerciseMedia';

/*
  Tiga keadaan (R-27): memuat (kerangka berdenyut), berhasil (foto), gagal atau belum ada (kotak berlabel jujur).
  Rasio 4:3 dipesan lewat CSS aspect-ratio agar tidak ada layout shift (R-40).
*/
export default function ExerciseMedia({ exercise, variant = 'card', priority = false }) {
  const media = getExerciseMedia(exercise.id);
  const [state, setState] = useState(media ? 'loading' : 'missing');

  useEffect(() => {
    setState(getExerciseMedia(exercise.id) ? 'loading' : 'missing');
  }, [exercise.id]);

  const Icon = exercise.type === 'cardio' ? HeartPulse : Dumbbell;

  return (
    <figure className={`exercise-media exercise-media-${variant} is-${state}`}>
      {media && state !== 'missing' && (
        <img
          className="exercise-media-img"
          src={media.src}
          alt={media.alt}
          width="900"
          height="675"
          decoding="async"
          referrerPolicy="no-referrer"
          style={{ objectPosition: media.focus }}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setState('ready')}
          onError={() => setState('missing')}
        />
      )}
      {state === 'loading' && <span className="exercise-media-skeleton" aria-hidden="true" />}
      {state === 'missing' && (
        <span className="exercise-media-empty" role="img" aria-label={`Foto ${exercise.name} belum tersedia`}>
          <Icon size={variant === 'detail' ? 36 : 28} strokeWidth={1.6} aria-hidden="true" />
          {variant === 'detail' && <span>Foto belum tersedia</span>}
        </span>
      )}
      <span className="exercise-media-muscle">{exercise.muscle}</span>
      {variant === 'detail' && media && state === 'ready' && (
        <figcaption className="exercise-media-credit">
          {MEDIA_KIND_LABEL[media.kind]}: {media.author},{' '}
          <a href={media.pageUrl} target="_blank" rel="noopener noreferrer">{media.source}<span className="visually-hidden"> (halaman sumber dan lisensi, tab baru)</span></a>
        </figcaption>
      )}
    </figure>
  );
}

ExerciseMedia.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    muscle: PropTypes.string.isRequired,
    type: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(['card', 'detail']),
  priority: PropTypes.bool,
};
