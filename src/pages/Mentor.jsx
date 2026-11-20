import { useState } from 'react';
import { useGym } from '../context/GymContext';
import MentorPhoto from '../components/MentorPhoto';
import {
  feelOptions, getMentorFor, getMentorName, getMentorState, levelGuidance, mentors,
} from '../data/mentors';
import { formatDate } from '../utils/dateUtils';

function feelLabel(value) {
  return feelOptions.find((item) => item.value === value)?.label || value;
}

export default function Mentor() {
  const { profile, history, goals, checkins, addCheckin } = useGym();
  const [selectedId, setSelectedId] = useState(() => getMentorFor(profile)?.id || null);
  const [feel, setFeel] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [replyId, setReplyId] = useState(null);

  const mentor = mentors.find((item) => item.id === selectedId) || null;
  const guidance = mentor ? levelGuidance[mentor.level] : null;
  const state = getMentorState(history, goals);
  const mentorCheckins = mentor ? checkins.filter((item) => item.mentorId === mentor.id) : [];
  const latestReply = mentorCheckins.find((item) => item.id === replyId);

  function submit(event) {
    event.preventDefault();
    if (!feel) {
      setError('Pilih dulu bagaimana rasa latihanmu minggu ini.');
      return;
    }
    const entry = addCheckin({ mentorId: mentor.id, feel, note: note.trim() });
    setReplyId(entry.id);
    setFeel('');
    setNote('');
    setError('');
  }

  return (
    <div className="page-stack">
      <section className="page-intro-row">
        <div>
          <p className="eyebrow">PENDAMPING LATIHAN</p>
          <h2>Pendamping latihanmu</h2>
          <p className="page-description">Mentor tersedia untuk level Pemula dan Menengah, satu untuk setiap gender. Pilih yang paling nyaman untukmu.</p>
        </div>
      </section>

      <div className="mentor-switch" role="group" aria-label="Pilih mentor">
        {mentors.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === selectedId}
            onClick={() => { setSelectedId(item.id); setReplyId(null); setError(''); }}
          >
            {item.level} · {item.genderLabel}
          </button>
        ))}
      </div>

      {!mentor && (
        <section className="panel empty-state mentor-empty">
          <strong>Level {profile.experience || 'kamu'} belum punya mentor</strong>
          <span>Mentor dibuat untuk level Pemula dan Menengah. Pilih salah satu mentor di atas bila ingin membaca panduannya.</span>
        </section>
      )}

      {mentor && (
        <>
          <section className="panel mentor-hero" aria-labelledby="mentor-name">
            <MentorPhoto key={mentor.id} mentor={mentor} />
            <div className="mentor-hero-copy">
              <p className="eyebrow">{mentor.role.toUpperCase()} / {mentor.genderLabel.toUpperCase()}</p>
              <h3 id="mentor-name">{getMentorName(mentor)}</h3>
              <p className="mentor-quote">{mentor.intro}</p>
              <div className="mentor-state">
                <strong>{state.done} dari {state.target} sesi</strong>
                <span>tercatat minggu ini, dihitung dari riwayat latihanmu.</span>
              </div>
              <p className="mentor-message">{guidance.states[state.key]}</p>
            </div>
          </section>

          <div className="mentor-layout">
            <section className="panel" aria-labelledby="mentor-focus-title">
              <p className="eyebrow">FOKUS PENDAMPINGAN</p>
              <h3 id="mentor-focus-title" className="mentor-h3">Yang aku bantu di level {mentor.level}</h3>
              <ol className="mentor-focus-list">
                {guidance.focus.map((item) => (
                  <li key={item.title}><strong>{item.title}</strong><p>{item.body}</p></li>
                ))}
              </ol>
            </section>

            <section className="panel" aria-labelledby="mentor-checkin-title">
              <p className="eyebrow">CHECK-IN MINGGUAN</p>
              <h3 id="mentor-checkin-title" className="mentor-h3">Bagaimana latihanmu minggu ini?</h3>
              <form className="form-stack" onSubmit={submit} noValidate>
                <fieldset className="mentor-feel">
                  <legend>Rasa latihan</legend>
                  {feelOptions.map((option) => (
                    <label key={option.value} className="mentor-feel-option">
                      <input type="radio" name="feel" value={option.value} checked={feel === option.value} onChange={() => { setFeel(option.value); setError(''); }} />
                      <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                    </label>
                  ))}
                </fieldset>
                <label className="form-field">
                  Catatan singkat (opsional)
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} placeholder="Contoh: lutut terasa kaku saat leg press" />
                </label>
                {error && <p className="onboard-error" role="alert">{error}</p>}
                <button className="button button-primary" type="submit">Kirim check-in minggu ini</button>
              </form>

              {latestReply && (
                <div className="mentor-reply" role="status">
                  <strong>Balasan {getMentorName(mentor)}</strong>
                  <p>{guidance.replies[latestReply.feel]}</p>
                </div>
              )}
              <p className="mentor-disclosure">Balasan mentor adalah panduan tertulis di dalam aplikasi. Mentor tidak membalas secara langsung. Jika ada nyeri atau gejala tidak biasa, hentikan latihan dan temui tenaga kesehatan atau instruktur.</p>
            </section>
          </div>

          <section className="panel" aria-labelledby="mentor-history-title">
            <p className="eyebrow">RIWAYAT CHECK-IN</p>
            <h3 id="mentor-history-title" className="mentor-h3">Catatan bersama {getMentorName(mentor)}</h3>
            {mentorCheckins.length ? (
              <ul className="mentor-history">
                {mentorCheckins.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                    <strong>{feelLabel(item.feel)}</strong>
                    <span>{item.note || 'Tanpa catatan.'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state compact-empty">
                <strong>Belum ada check-in</strong>
                <span>Kirim check-in pertamamu di atas. Catatannya muncul di sini.</span>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
