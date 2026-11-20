import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createInitialData } from '../data/initialData';
import { calculateBMI, getBMICategory } from '../utils/personalization';
import { toISODate } from '../utils/dateUtils';

const GymContext = createContext(null);
const STORAGE_KEY = 'fitplanner-data-v1';

function readSavedData() {
  const initial = createInitialData();
  if (typeof window === 'undefined') return { data: initial, notice: null };

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { data: initial, notice: null };

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new TypeError('Format penyimpanan tidak sesuai.');
    }

    const starterIds = new Set(initial.workouts.map((item) => item.id));
    return {
      data: {
        ...initial,
        ...parsed,
        workouts: Array.isArray(parsed.workouts)
          ? parsed.workouts.map((item) => ({
              ...item,
              isStarter: typeof item.isStarter === 'boolean'
                ? item.isStarter
                : starterIds.has(item.id),
              exerciseIds: Array.isArray(item.exerciseIds) ? item.exerciseIds : [],
            }))
          : initial.workouts,
        schedules: Array.isArray(parsed.schedules) ? parsed.schedules : initial.schedules,
        history: Array.isArray(parsed.history) ? parsed.history : initial.history,
        measurements: Array.isArray(parsed.measurements) ? parsed.measurements : initial.measurements,
        checkins: Array.isArray(parsed.checkins) ? parsed.checkins : initial.checkins,
        goals: { ...initial.goals, ...(parsed.goals || {}) },
        profile: { ...initial.profile, ...(parsed.profile || {}) },
      },
      notice: null,
    };
  } catch (error) {
    console.warn('FitPlanner tidak dapat membaca data lokal.', error);
    return {
      data: initial,
      notice: 'Data lama tidak dapat dibaca. FitPlanner dibuka dengan data awal; periksa kembali profil sebelum melanjutkan.',
    };
  }
}

export function GymProvider({ children }) {
  const [savedState] = useState(readSavedData);
  const [data, setData] = useState(savedState.data);
  const [toast, setToast] = useState(null);
  const [storageNotice, setStorageNotice] = useState(savedState.notice);
  const storageWriteFailed = useRef(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (storageWriteFailed.current) {
        storageWriteFailed.current = false;
        setStorageNotice(null);
      }
    } catch (error) {
      storageWriteFailed.current = true;
      console.warn('FitPlanner tidak dapat menyimpan data lokal.', error);
      setStorageNotice('Browser tidak dapat menyimpan data FitPlanner. Perubahan mungkin hilang saat halaman ditutup.');
    }
  }, [data]);

  const notify = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const addWorkout = useCallback((input) => {
    const workout = { ...input, id: `workout-${Date.now()}`, isStarter: false };
    setData((current) => ({ ...current, workouts: [workout, ...current.workouts] }));
    notify('Program latihan berhasil ditambahkan.');
    return workout;
  }, [notify]);

  const updateWorkout = useCallback((id, input) => {
    setData((current) => ({
      ...current,
      workouts: current.workouts.map((item) => item.id === id ? { ...item, ...input } : item),
    }));
    notify('Program latihan berhasil diperbarui.');
  }, [notify]);

  const deleteWorkout = useCallback((id) => {
    setData((current) => ({
      ...current,
      workouts: current.workouts.filter((item) => item.id !== id),
    }));
    notify('Program latihan dihapus. Jadwal yang sudah dibuat tetap tersimpan.');
  }, [notify]);

  const addSchedule = useCallback((input) => {
    const schedule = { ...input, id: `schedule-${Date.now()}`, status: 'planned' };
    setData((current) => ({ ...current, schedules: [...current.schedules, schedule] }));
    notify('Jadwal latihan berhasil dibuat.');
  }, [notify]);

  const updateSchedule = useCallback((id, input) => {
    setData((current) => ({
      ...current,
      schedules: current.schedules.map((item) => item.id === id ? { ...item, ...input } : item),
    }));
    notify('Jadwal latihan berhasil diperbarui.');
  }, [notify]);

  const deleteSchedule = useCallback((id) => {
    setData((current) => ({
      ...current,
      schedules: current.schedules.filter((item) => item.id !== id),
    }));
    notify('Jadwal latihan dihapus.');
  }, [notify]);

  const completeSchedule = useCallback((id) => {
    setData((current) => {
      const selected = current.schedules.find((item) => item.id === id);
      if (!selected || selected.status === 'completed') return current;

      const historyEntry = {
        id: `history-${Date.now()}`,
        workoutName: selected.workoutName,
        focus: selected.focus,
        date: selected.date,
        duration: Number(selected.duration) || 0,
        completedAt: new Date().toISOString(),
      };

      return {
        ...current,
        schedules: current.schedules.map((item) => item.id === id ? { ...item, status: 'completed' } : item),
        history: [historyEntry, ...current.history],
      };
    });
    notify('Latihan ditandai selesai. Riwayat dan ringkasan aktivitas diperbarui.');
  }, [notify]);

  const addMeasurement = useCallback((input) => {
    setData((current) => {
      const latestMeasurement = current.measurements.reduce(
        (latest, item) => (!latest || item.date > latest.date ? item : latest),
        null,
      );
      const shouldUpdateCurrentWeight = !latestMeasurement || input.date >= latestMeasurement.date;

      return {
        ...current,
        measurements: [...current.measurements, { ...input, id: `measurement-${Date.now()}` }]
          .sort((a, b) => a.date.localeCompare(b.date)),
        profile: shouldUpdateCurrentWeight
          ? (() => {
              const nextWeight = Number(input.weight);
              const bmi = calculateBMI(nextWeight, current.profile.height);
              const bmiCategory = getBMICategory(bmi, current.profile.age).key;
              return { ...current.profile, weight: nextWeight, bmi, bmiCategory };
            })()
          : current.profile,
      };
    });
    notify('Catatan berat badan berhasil disimpan.');
  }, [notify]);

  const addCheckin = useCallback((input) => {
    const entry = { ...input, id: `checkin-${Date.now()}`, date: toISODate(new Date()) };
    setData((current) => ({ ...current, checkins: [entry, ...current.checkins] }));
    notify('Check-in mingguan tersimpan.');
    return entry;
  }, [notify]);

  const updateGoals = useCallback((input) => {
    setData((current) => ({ ...current, goals: { ...current.goals, ...input } }));
    notify('Target kebugaran berhasil diperbarui.');
  }, [notify]);

  const updateProfile = useCallback((input) => {
    setData((current) => ({ ...current, profile: { ...current.profile, ...input } }));
    notify('Profil berhasil diperbarui.');
  }, [notify]);

  const dismissToast = useCallback(() => setToast(null), []);
  const dismissStorageNotice = useCallback(() => setStorageNotice(null), []);

  const value = useMemo(() => ({
    ...data,
    toast,
    storageNotice,
    notify,
    dismissToast,
    dismissStorageNotice,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    completeSchedule,
    addMeasurement,
    addCheckin,
    updateGoals,
    updateProfile,
  }), [
    data, toast, storageNotice, notify, dismissToast, dismissStorageNotice,
    addWorkout, updateWorkout, deleteWorkout, addSchedule, updateSchedule,
    deleteSchedule, completeSchedule, addMeasurement, addCheckin, updateGoals, updateProfile,
  ]);

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

export function useGym() {
  const context = useContext(GymContext);
  if (!context) throw new Error('useGym harus digunakan di dalam GymProvider.');
  return context;
}
