import { Link } from 'react-router-dom';
import {
  CalendarDays, CheckCircle2, Clock3, Dumbbell,
  Plus, Target, TrendingUp,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Logo from '../components/Logo';
import MentorPhoto from '../components/MentorPhoto';
import { getMentorFor, getMentorName, getMentorState, levelGuidance } from '../data/mentors';
import { useGym } from '../context/GymContext';
import { formatShortDate, getRelativeDateLabel, getWeekDays, isDateInCurrentWeek } from '../utils/dateUtils';

function WeeklyActivity({ history }) {
  const days = getWeekDays();
  const values = days.map((day) => history
    .filter((item) => item.date === day)
    .reduce((total, item) => total + Number(item.duration || 0), 0));
  const hasActivity = values.some((value) => value > 0);
  const scaleMax = Math.max(30, Math.ceil(Math.max(...values) / 30) * 30);
  const axisLabels = [scaleMax, Math.round(scaleMax * 2 / 3), Math.round(scaleMax / 3), 0];

  if (!hasActivity) {
    return (
      <div className="chart-no-data">
        <Dumbbell size={22} aria-hidden="true" />
        <strong>Belum ada sesi minggu ini</strong>
        <span>Selesaikan jadwal latihan untuk mulai mengisi grafik aktivitas.</span>
      </div>
    );
  }

  return (
    <div className="weekly-chart" role="img" aria-label={`Durasi latihan minggu ini: ${values.map((value, index) => `${days[index]} ${value} menit`).join(', ')}`}>
      <div className="chart-y-labels" aria-hidden="true">
        {axisLabels.map((value, index) => <span key={`${value}-${index}`}>{value}m</span>)}
      </div>
      <div className="chart-bars-area" aria-hidden="true">
        <div className="chart-grid-lines"><i /><i /><i /><i /></div>
        {days.map((day, index) => (
          <div className="chart-day" key={day}>
            <div className="chart-bar-track" title={`${values[index]} menit`}>
              <div
                className={`chart-bar ${values[index] > 0 ? 'has-value' : ''}`}
                style={{ height: `${values[index] ? Math.max(4, (values[index] / scaleMax) * 100) : 3}%` }}
              />
            </div>
            <span className="chart-day-label">{new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(new Date(`${day}T12:00:00`))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { workouts, schedules, history, goals, profile } = useGym();
  const completedThisWeek = history.filter((item) => isDateInCurrentWeek(item.date));
  const totalMinutes = completedThisWeek.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const target = Math.max(1, Number(goals.weeklyWorkoutTarget) || 1);
  const goalPercent = Math.min(100, Math.round((completedThisWeek.length / target) * 100));
  const starterCount = workouts.filter((item) => item.isStarter).length;
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const upcoming = [...schedules]
    .filter((item) => item.status === 'planned' && item.date >= todayISO)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 3);
  const recent = [...history]
    .sort((a, b) => `${b.date}T${b.completedAt || ''}`.localeCompare(`${a.date}T${a.completedAt || ''}`))
    .slice(0, 4);
  const firstName = (profile.name || 'teman latihan').trim().split(' ')[0];
  const mentor = getMentorFor(profile);
  const mentorState = getMentorState(history, goals);

  return (
    <div className="page-stack">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="welcome-kicker">Ruang latihanmu</span>
          <h2>Selamat datang, <em>{firstName}.</em></h2>
          <p>Atur sesi yang masuk akal untuk harimu. Catat latihan setelah selesai, lalu lihat perkembangannya di sini.</p>
          <div className="welcome-actions">
            <Link className="button button-primary" to="/workouts"><Plus size={16} aria-hidden="true" /> Buat program</Link>
            <Link className="button button-ghost" to="/progress">Lihat progress</Link>
          </div>
        </div>
        <div className="welcome-visual">
          <Logo variant="hero" />
        </div>
      </section>

      <section className="stats-strip" aria-label="Ringkasan aktivitas">
        <StatCard label="Sesi selesai" value={completedThisWeek.length} helper={`Minggu ini, ${goalPercent}% dari target`} icon={Dumbbell} />
        <StatCard label="Menit latihan" value={`${totalMinutes} mnt`} helper="Durasi tercatat minggu ini" icon={Clock3} />
        <StatCard label="Program tersedia" value={workouts.length} helper={starterCount ? `${starterCount} program contoh` : 'Program yang kamu buat'} icon={Target} />
      </section>

      {mentor && (
        <section className="mentor-note" aria-labelledby="mentor-note-title">
          <MentorPhoto mentor={mentor} size="sm" />
          <div className="mentor-note-copy">
            <p className="eyebrow">CATATAN MENTOR</p>
            <h2 id="mentor-note-title">{getMentorName(mentor)}</h2>
            <p>{levelGuidance[mentor.level].states[mentorState.key]}</p>
          </div>
          <Link className="button button-secondary" to="/mentor">Buka check-in mingguan</Link>
        </section>
      )}

      <section className="dashboard-grid">
        <article className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">CATATAN AKTIVITAS</p>
              <h2>Aktivitas minggu ini</h2>
              <p className="panel-subtitle">Durasi latihan berdasarkan jadwal yang kamu tandai selesai.</p>
            </div>
            <span className="panel-icon"><TrendingUp size={18} aria-hidden="true" /></span>
          </div>
          <WeeklyActivity history={completedThisWeek} />
        </article>

        <article className="panel goal-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">TARGET LATIHAN</p>
              <h2>Komitmen mingguan</h2>
            </div>
            <span className="panel-icon"><Target size={18} aria-hidden="true" /></span>
          </div>
          <div className="goal-progress-wrap">
            <div className="goal-progress-ring" style={{ '--progress': `${goalPercent * 3.6}deg` }}>
              <div><strong>{goalPercent}%</strong><span>tercapai</span></div>
            </div>
            <div className="goal-progress-copy">
              <strong>{completedThisWeek.length} dari {target} sesi</strong>
              <p>{goalPercent >= 100 ? 'Target minggu ini sudah tercapai. Beri tubuh waktu untuk pulih.' : `${Math.max(0, target - completedThisWeek.length)} sesi lagi untuk mencapai target minggu ini.`}</p>
              <Link to="/goals" className="inline-link">Atur target</Link>
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-grid lower-dashboard-grid">
        <article className="panel schedule-panel">
          <div className="panel-heading panel-heading-row">
            <div><p className="eyebrow">SELANJUTNYA</p><h2>Jadwal mendatang</h2></div>
            <Link to="/schedule" className="inline-link">Semua jadwal</Link>
          </div>
          {upcoming.length ? (
            <div className="upcoming-list">
              {upcoming.map((item) => (
                <div className="upcoming-item" key={item.id}>
                  <div className="upcoming-date"><strong>{formatShortDate(item.date).split(' ')[0]}</strong><span>{formatShortDate(item.date).split(' ').slice(1).join(' ')}</span></div>
                  <div className="upcoming-info"><strong>{item.workoutName}</strong><span>{item.focus}</span></div>
                  <div className="upcoming-time"><Clock3 size={14} aria-hidden="true" /> {item.time}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state compact-empty">
              <CalendarDays size={22} aria-hidden="true" />
              <strong>Belum ada jadwal mendatang</strong>
              <span>Pilih program latihan lalu tentukan hari dan waktunya.</span>
              <Link to="/schedule" className="text-button">Tambah jadwal</Link>
            </div>
          )}
        </article>

        <article className="panel history-panel">
          <div className="panel-heading panel-heading-row">
            <div><p className="eyebrow">SESI TERAKHIR</p><h2>Riwayat latihan</h2></div>
            <Link to="/history" className="inline-link">Lihat semua</Link>
          </div>
          {recent.length ? (
            <div className="recent-list">
              {recent.map((item) => (
                <div className="recent-item" key={item.id}>
                  <div className="recent-icon"><CheckCircle2 size={17} aria-hidden="true" /></div>
                  <div className="recent-info"><strong>{item.workoutName}</strong><span>{getRelativeDateLabel(item.date)} · {item.duration} menit</span></div>
                  <span className="completed-tag">Selesai</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state compact-empty">
              <Dumbbell size={22} aria-hidden="true" />
              <strong>Belum ada riwayat latihan</strong>
              <span>Riwayat muncul setelah kamu menandai jadwal sebagai selesai.</span>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
