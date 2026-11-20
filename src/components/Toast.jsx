import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useGym } from '../context/GymContext';

/* Notifikasi muncul dari bawah dan keluar dengan animasi singkat; durasi tampil 3,2 detik. */
export default function Toast() {
  const { toast, dismissToast } = useGym();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    setLeaving(false);
    const leave = window.setTimeout(() => setLeaving(true), 2950);
    const done = window.setTimeout(dismissToast, 3200);
    return () => { window.clearTimeout(leave); window.clearTimeout(done); };
  }, [toast, dismissToast]);

  if (!toast) return null;
  const Icon = toast.type === 'error' ? AlertCircle : CheckCircle2;

  return (
    <div className={`toast toast-${toast.type} ${leaving ? 'is-leaving' : ''}`} role="status">
      <Icon size={18} aria-hidden="true" />
      <span>{toast.message}</span>
      <button type="button" onClick={dismissToast} aria-label="Tutup notifikasi"><X size={16} aria-hidden="true" /></button>
    </div>
  );
}
