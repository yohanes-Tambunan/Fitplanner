/*
  Umpan balik saat tombol ditekan: gelombang kecil yang keluar dari titik sentuh.
  Tujuan (R-19): memastikan penekanan terdaftar, terutama di layar sentuh. Tidak dipasang bila
  pengguna memilih prefers-reduced-motion. Elemen target harus position: relative dan overflow: hidden
  (diatur di styles/motion.css).
*/
const TARGETS = [
  '.button', '.icon-button', '.filter-chip', '.text-button', '.text-action',
  '.onboard-choice', '.onboard-level', '.frequency-option', '.mentor-switch button',
].join(',');

export function installPressFeedback() {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (query.matches) return;

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || query.matches) return;
    const target = event.target instanceof Element ? event.target.closest(TARGETS) : null;
    if (!target || target.disabled || target.getAttribute('aria-disabled') === 'true') return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const wave = document.createElement('span');
    wave.className = 'press-wave';
    wave.setAttribute('aria-hidden', 'true');
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.left = `${event.clientX - rect.left - size / 2}px`;
    wave.style.top = `${event.clientY - rect.top - size / 2}px`;
    target.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove(), { once: true });
  }, { passive: true });
}
