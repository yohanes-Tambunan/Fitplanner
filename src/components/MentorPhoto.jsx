import { useState } from 'react';
import PropTypes from 'prop-types';
import { getMentorName } from '../data/mentors';

export default function MentorPhoto({ mentor, size = 'lg' }) {
  const [failed, setFailed] = useState(false);
  const name = getMentorName(mentor);
  const small = size === 'sm';

  if (!failed) {
    return (
      <img
        className={`mentor-photo ${small ? 'mentor-photo-sm' : ''}`}
        src={mentor.photo}
        alt={`Foto ${name}`}
        width={small ? 64 : 320}
        height={small ? 64 : 400}
        onError={() => setFailed(true)}
      />
    );
  }

  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
  return (
    <div className={`mentor-photo-empty ${small ? 'mentor-photo-sm' : ''}`} role="img" aria-label={`Foto ${name} belum dipasang`}>
      <strong aria-hidden="true">{initials}</strong>
      {!small && <span>Foto mentor belum dipasang</span>}
    </div>
  );
}

MentorPhoto.propTypes = {
  mentor: PropTypes.shape({ photo: PropTypes.string.isRequired }).isRequired,
  size: PropTypes.oneOf(['lg', 'sm']),
};
