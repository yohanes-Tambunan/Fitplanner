import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <Logo variant="compact" />
      <p className="eyebrow">404 / HALAMAN TIDAK DITEMUKAN</p>
      <h1>Halaman ini sedang istirahat.</h1>
      <p>Halaman yang kamu cari tidak tersedia atau alamatnya sudah berubah.</p>
      <Link to="/" className="button button-primary"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke dashboard</Link>
    </main>
  );
}
