import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useGym } from '../context/GymContext';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { storageNotice, dismissStorageNotice } = useGym();
  const location = useLocation();

  useEffect(() => {
    function closeMenu(event) {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    }

    window.addEventListener('keydown', closeMenu);
    return () => window.removeEventListener('keydown', closeMenu);
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Lewati ke konten</a>
      {mobileMenuOpen && (
        <button
          className="mobile-sidebar-backdrop"
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="app-main">
        <Navbar onOpenMenu={() => setMobileMenuOpen(true)} mobileMenuOpen={mobileMenuOpen} />
        {storageNotice && (
          <div className="storage-notice" role="alert">
            <p>{storageNotice}</p>
            <button type="button" onClick={dismissStorageNotice} aria-label="Tutup pemberitahuan">Tutup</button>
          </div>
        )}
        <main id="main-content" className="page-content" tabIndex={-1}>
          {/* key = rute: konten baru masuk dengan animasi singkat setiap pindah halaman (orientasi, bukan dekorasi) */}
          <div className="page-transition" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
      <Toast />
    </div>
  );
}
