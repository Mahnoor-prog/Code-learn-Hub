const DAY_MS = 24 * 60 * 60 * 1000;
const PREFIX = 'clh_personalization';

const buildKey = (suffix) => `${PREFIX}_${suffix}`;

export const getCachedValue = (suffix) => {
  try {
    const raw = localStorage.getItem(buildKey(suffix));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > DAY_MS) {
      localStorage.removeItem(buildKey(suffix));
      return null;
    }
    return parsed.value ?? null;
  } catch {
    return null;
  }
};

export const setCachedValue = (suffix, value) => {
  try {
    localStorage.setItem(buildKey(suffix), JSON.stringify({
      savedAt: Date.now(),
      value
    }));
  } catch {
    // Ignore storage errors
  }
};

export const clearCachedValue = (suffix) => {
  localStorage.removeItem(buildKey(suffix));
};
