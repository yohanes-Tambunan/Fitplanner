import PropTypes from 'prop-types';
import {
  Activity, BarChart3, CalendarDays, Dumbbell,
  GraduationCap, History, LayoutDashboard, Target, UserRound, X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useGym } from '../context/GymContext';
import Logo from './Logo';
import { getFocusCopy } from '../utils/personalization';

const navigation = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, end: true },
  { label: 'Workout Plan', path: '/workouts', icon: Dumbbell },
  { label: 'Exercise Library', path: '/exercises', icon: Activity },
  { label: 'Jadwal', path: '/schedule', icon: CalendarDays },
  { label: 'Riwayat', path: '/history', icon: History },
  { label: 'Progress', path: '/progress', icon: BarChart3 },
  { label: 'Target', path: '/goals', icon: Target },
  { label: 'Mentor', path: '/mentor', icon: GraduationCap },
];

export default function Sidebar({ isOpen, onClose }) {
  const { profile } = useGym();
  const focusCopy = getFocusCopy(profile);

  return (
    <aside id="primary-navigation" className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} aria-label="Panel navigasi">
      <div className="sidebar-brand">
        <NavLink to="/" end onClick={onClose} className="sidebar-brand-link" aria-label="Ke Dashboard">
          <Logo variant="sidebar" />
        </NavLink>
        <button className="icon-button sidebar-close" type="button" onClick={onClose} aria-label="Tutup menu">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Navigasi utama">
        {navigation.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-spacer" />
      <section className="sidebar-focus" aria-labelledby="sidebar-focus-title">
        <p className="sidebar-focus-label">Fokus latihan</p>
        <strong id="sidebar-focus-title">{focusCopy.title}</strong>
        <p>{focusCopy.body}</p>
      </section>

      <NavLink to="/profile" onClick={onClose} className={({ isActive }) => `sidebar-profile ${isActive ? 'profile-active' : ''}`}>
        <span className="avatar"><UserRound size={18} aria-hidden="true" /></span>
        <span className="sidebar-profile-copy">
          <strong>{profile.name || 'Profil latihan'}</strong>
          <span>Lihat data profil</span>
        </span>
      </NavLink>
    </aside>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
