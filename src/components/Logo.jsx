import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dumbbell } from 'lucide-react';
import { BRAND } from '../config/brand';

/*
  Varian ukuran (lihat .brand-logo-* di styles/components.css):
  - sidebar : mengisi lebar sidebar, ikut membesar di layar lebar
  - hero    : logo besar di Dashboard, menggantikan ornamen dumbbell
  - aside   : panel onboarding
  - compact : halaman 404
  Alasan: ukuran memakai satuan rem/clamp, sehingga mengikuti ukuran jendela, bukan angka piksel tetap.
  Semua varian berada di bagian atas layar, jadi dimuat segera (tidak lazy).
*/
export default function Logo({ variant = 'sidebar' }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        className={`brand-logo brand-logo-${variant}`}
        src={BRAND.logoSrc}
        alt={BRAND.logoAlt}
        width={BRAND.logoWidth}
        height={BRAND.logoHeight}
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={`brand-fallback brand-fallback-${variant}`}>
      <span className="brand-fallback-mark"><Dumbbell size={22} strokeWidth={2.5} aria-hidden="true" /></span>
      <span className="brand-fallback-name">{BRAND.name}</span>
    </div>
  );
}

Logo.propTypes = {
  variant: PropTypes.oneOf(['sidebar', 'hero', 'aside', 'compact']),
};
