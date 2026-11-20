import PropTypes from 'prop-types';

/* Satu sel pada strip ringkasan Dashboard. Bukan kartu terpisah: tiga angka dibaca berurutan dalam satu panel. */
export default function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <article className="stat-cell">
      <span className="stat-label"><Icon size={16} strokeWidth={1.9} aria-hidden="true" /> {label}</span>
      <strong className="stat-value">{value}</strong>
      {helper && <span className="stat-helper">{helper}</span>}
    </article>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  helper: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
};
