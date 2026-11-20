import PropTypes from 'prop-types';
import { Menu, Plus, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const pageTitles = {
  '/': ['Dashboard', 'Ringkasan aktivitas latihanmu'],
  '/workouts': ['Program Latihan', 'Susun program latihan sesuai tujuanmu'],
  '/exercises': ['Daftar Gerakan', 'Temukan gerakan dan pelajari tekniknya'],
  '/schedule': ['Jadwal Latihan', 'Atur waktu latihan dan waktu pemulihan'],
  '/history': ['Riwayat Latihan', 'Catatan sesi yang sudah kamu selesaikan'],
  '/progress': ['Progres', 'Pantau perubahan berdasarkan catatanmu'],
  '/goals': ['Target Latihan', 'Atur target yang realistis untuk rutinitasmu'],
  '/mentor': ['Mentor', 'Pendamping latihan dan check-in mingguan'],
  '/profile': ['Profil', 'Kelola informasi dan preferensi latihan'],
};

/*
  Dihapus dari versi sebelumnya (alasan: duplikat navigasi yang sudah ada di sidebar):
  tombol ikon kalender dan chip nama pengguna.
*/
export default function Navbar({ onOpenMenu, mobileMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [title, subtitle] = pageTitles[location.pathname] || pageTitles['/'];
  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());

  return (
    <header className="topbar">
      <div className="topbar-heading">
        <button
          className="icon-button mobile-menu-button"
          onClick={onOpenMenu}
          type="button"
          aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={mobileMenuOpen}
          aria-controls="primary-navigation"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <div>
          <div className="topbar-title-row">
            <h1>{title}</h1>
            <span className="topbar-date">{today}</span>
          </div>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="topbar-actions">
        <button
          className="icon-button topbar-search"
          type="button"
          onClick={() => navigate('/exercises', { state: { focusSearch: true } })}
          aria-label="Cari gerakan"
          title="Cari gerakan"
        >
          <Search size={18} aria-hidden="true" />
        </button>
        <button className="button button-primary topbar-create" type="button" onClick={() => navigate('/workouts', { state: { openCreate: true } })}>
          <Plus size={17} aria-hidden="true" /> <span>Workout baru</span>
        </button>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  onOpenMenu: PropTypes.func.isRequired,
  mobileMenuOpen: PropTypes.bool.isRequired,
};
