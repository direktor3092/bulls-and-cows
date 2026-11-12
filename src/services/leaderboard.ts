export interface LeaderboardEntry {
  attempts: number;
  timeMs: number;
  length: number;
  base: number;
  timestamp: number;
}

const STORAGE_KEY = 'bulls_cows_leaderboard';
const MAX_ENTRIES = 10;

export const loadLeaderboard = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveLeaderboard = (entries: LeaderboardEntry[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const sortLeaderboard = (
  entries: LeaderboardEntry[],
): LeaderboardEntry[] => {
  return [...entries].sort((a, b) => {
    if (a.attempts !== b.attempts) return a.attempts - b.attempts;
    return a.timeMs - b.timeMs;
  });
};

export const addRecord = (
  entries: LeaderboardEntry[],
  record: LeaderboardEntry,
): LeaderboardEntry[] => {
  const sorted = sortLeaderboard([...entries, record]);
  return sorted.slice(0, MAX_ENTRIES);
};

export const saveRecord = (record: LeaderboardEntry): LeaderboardEntry[] => {
  const current = loadLeaderboard();
  const updated = addRecord(current, record);
  saveLeaderboard(updated);
  return updated;
};
