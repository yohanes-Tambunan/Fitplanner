import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Scale,
  TrendingUp,
  Weight,
} from 'lucide-react';
import Modal from '../components/Modal';
import { useGym } from '../context/GymContext';
import { formatDate, formatShortDate } from '../utils/dateUtils';

function WeightChart({ measurements }) {
  if (!measurements.length) {
    return (
      <div className="empty-state chart-empty">
        <Weight size={24} aria-hidden="true" />
        <strong>Belum ada data berat badan</strong>
        <span>Tambahkan catatan untuk mulai melihat perkembangan.</span>
      </div>
    );
  }

  const values = measurements.slice(-8);
  const weights = values.map((item) => Number(item.weight));
  const min = Math.min(...weights) - 0.5;
  const max = Math.max(...weights) + 0.5;
  const range = Math.max(1, max - min);
  const points = values.map((item, index) => {
    const x = values.length === 1 ? 300 : 42 + (index / (values.length - 1)) * 516;
    const y = 150 - ((Number(item.weight) - min) / range) * 112;
    return { x, y, ...item };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ');
  const area = values.length > 1
    ? `42,166 ${polyline} ${points[points.length - 1].x},166`
    : '';

  return (
    <div className="weight-chart-wrap">
      <div className="chart-legend">
        <span><i aria-hidden="true" /> Berat badan</span>
        <span>{values.length} catatan terakhir</span>
      </div>
      <svg
        className="weight-chart"
        viewBox="0 0 600 190"
        role="img"
        aria-label={`Grafik berat badan dari ${values.length} catatan terakhir`}
      >
        {[38, 76, 114, 152].map((y) => (
          <line
            key={y}
            x1="42"
            y1={y}
            x2="558"
            y2={y}
            className="weight-grid-line"
          />
        ))}
        {values.length > 1 && <polygon points={area} className="weight-chart-area" />}
        {values.length > 1 && <polyline points={polyline} className="weight-chart-line" />}
        {points.map((point) => (
          <g key={point.id}>
            <circle cx={point.x} cy={point.y} r="5" className="weight-chart-point" />
            <circle cx={point.x} cy={point.y} r="2" className="weight-chart-point-center">
              <title>{`${point.weight} kg, ${formatDate(point.date)}`}</title>
            </circle>
          </g>
        ))}
        {points.map((point) => (
          <text
            key={`${point.id}-label`}
            x={point.x}
            y="184"
            textAnchor="middle"
            className="weight-chart-label"
          >
            {formatShortDate(point.date)}
          </text>
        ))}
      </svg>
      {values.length === 1 && (
        <p className="chart-single-note">
          Tambahkan setidaknya satu catatan lagi untuk melihat arah perubahan.
        </p>
      )}
    </div>
  );
}

function MeasurementForm({ onSave, onCancel }) {
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
  const [date, setDate] = useState(todayString);
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const numericWeight = Number(weight);

    if (!date || date > todayString) {
      setError('Pilih tanggal hari ini atau tanggal sebelumnya.');
      return;
    }
    if (!Number.isFinite(numericWeight) || numericWeight < 20 || numericWeight > 300) {
      setError('Berat badan harus berada di antara 20 sampai 300 kg.');
      return;
    }

    onSave({ date, weight: Number(numericWeight.toFixed(1)) });
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="form-field">
        Tanggal pencatatan
        <input
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setError('');
          }}
          max={todayString}
          required
        />
      </label>
      <label className="form-field">
        Berat badan (kg)
        <input
          type="number"
          min="20"
          max="300"
          step="0.1"
          value={weight}
          onChange={(event) => {
            setWeight(event.target.value);
            setError('');
          }}
          placeholder="Contoh: 70.5"
          required
        />
      </label>
      <p className="form-hint">
        Catat pada kondisi dan waktu yang relatif sama agar hasilnya lebih mudah dibandingkan.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="modal-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>
          Batal
        </button>
        <button className="button button-primary" type="submit">
          Simpan catatan
        </button>
      </div>
    </form>
  );
}

export default function Progress() {
  const { measurements, history, profile, addMeasurement } = useGym();
  const [showForm, setShowForm] = useState(false);
  const sorted = useMemo(
    () => [...measurements].sort((a, b) => a.date.localeCompare(b.date)),
    [measurements],
  );
  const currentWeight = sorted.length
    ? Number(sorted[sorted.length - 1].weight)
    : Number(profile.weight) || 0;
  const firstWeight = sorted.length ? Number(sorted[0].weight) : currentWeight;
  const change = currentWeight - firstWeight;
  const totalMinutes = history.reduce(
    (sum, item) => sum + Number(item.duration || 0),
    0,
  );

  function handleSave(input) {
    addMeasurement(input);
    setShowForm(false);
  }

  return (
    <div className="page-stack">
      <section className="page-intro-row">
        <div>
          <p className="eyebrow">CATAT PERKEMBANGAN</p>
          <h2>Progres latihan</h2>
          <p className="page-description">
            Perhatikan tren dan konsistensi, bukan hanya angka pada satu hari.
          </p>
        </div>
        <button className="button button-primary" type="button" onClick={() => setShowForm(true)}>
          <Plus size={17} aria-hidden="true" /> Catat berat badan
        </button>
      </section>

      <section className="progress-stat-grid" aria-label="Ringkasan aktivitas">
        <article className="progress-stat-card">
          <span className="progress-stat-icon"><Scale size={18} aria-hidden="true" /></span>
          <span className="progress-stat-label">Berat badan terbaru</span>
          <strong>{currentWeight ? <>{currentWeight.toFixed(1)} <small>kg</small></> : '-'}</strong>
          <span className="progress-stat-note">
            {sorted.length ? 'Berdasarkan catatan terakhir' : 'Belum ada pengukuran'}
          </span>
        </article>
        <article className="progress-stat-card">
          <span className="progress-stat-icon progress-icon-orange"><Activity size={18} aria-hidden="true" /></span>
          <span className="progress-stat-label">Sesi latihan</span>
          <strong>{history.length}</strong>
          <span className="progress-stat-note">Total latihan selesai</span>
        </article>
        <article className="progress-stat-card">
          <span className="progress-stat-icon progress-icon-blue"><TrendingUp size={18} aria-hidden="true" /></span>
          <span className="progress-stat-label">Durasi latihan</span>
          <strong>{totalMinutes} <small>menit</small></strong>
          <span className="progress-stat-note">Total durasi yang tercatat</span>
        </article>
      </section>

      <section className="panel weight-progress-panel" aria-labelledby="weight-progress-title">
        <div className="panel-heading panel-heading-row">
          <div>
            <p className="eyebrow">DATA TUBUH</p>
            <h2 id="weight-progress-title">Perubahan berat badan</h2>
            <p className="panel-subtitle">Grafik dibuat dari catatan yang kamu masukkan.</p>
          </div>
          {sorted.length >= 2 && (
            change <= 0 ? (
              <span className="change-indicator change-down">
                <ArrowDownRight size={15} aria-hidden="true" /> {Math.abs(change).toFixed(1)} kg
              </span>
            ) : (
              <span className="change-indicator change-up">
                <ArrowUpRight size={15} aria-hidden="true" /> {change.toFixed(1)} kg
              </span>
            )
          )}
        </div>
        <WeightChart measurements={sorted} />
        <div className="weight-chart-footer">
          <span><strong>{sorted.length}</strong> catatan</span>
          <span>Catatan pertama: {sorted.length ? formatDate(sorted[0].date) : '-'}</span>
          <span>Terbaru: {sorted.length ? formatDate(sorted[sorted.length - 1].date) : '-'}</span>
        </div>
      </section>

      <section className="panel measurement-history-panel" aria-labelledby="measurement-history-title">
        <div className="panel-heading panel-heading-row">
          <div>
            <p className="eyebrow">RIWAYAT PENGUKURAN</p>
            <h2 id="measurement-history-title">Catatan berat badan</h2>
          </div>
          <span className="panel-count">{sorted.length} catatan</span>
        </div>
        {sorted.length ? (
          <div className="measurement-list">
            {[...sorted].reverse().slice(0, 6).map((item, index) => (
              <div className="measurement-row" key={item.id}>
                <span className="measurement-index">{String(sorted.length - index).padStart(2, '0')}</span>
                <span className="measurement-date">{formatDate(item.date)}</span>
                <strong>{Number(item.weight).toFixed(1)} kg</strong>
                <span className="measurement-status">{index === 0 ? 'Terbaru' : 'Tersimpan'}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state compact-empty">
            <Weight size={22} aria-hidden="true" />
            <strong>Belum ada pengukuran</strong>
            <span>Tambahkan berat badan untuk memulai pencatatan.</span>
          </div>
        )}
      </section>

      <p className="schedule-footnote">
        Berat badan hanyalah salah satu indikator. Kekuatan, energi, kualitas tidur, dan
        konsistensi juga bagian dari progres.
      </p>

      {showForm && (
        <Modal
          title="Catat berat badan"
          subtitle="Masukkan pengukuran terbaru."
          onClose={() => setShowForm(false)}
        >
          <MeasurementForm onSave={handleSave} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
