import { CONFIG } from './config.js';
const DEFAULT_STATE = Object.freeze({
  completedChapters: [], openedChapters: [1], foundSecrets: [],
  receivedEnvelopes: [], openedEnvelopes: [], continuedEnvelopes: [], rewards: [],
  introSurvey: { answers: {}, completed: false },
  music: { enabled: false, volume: CONFIG.music.defaultVolume }, gameResults: {}, totalProgress: 0
});
function cloneDefaultState() { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
function normalise(state) {
  const next = { ...cloneDefaultState(), ...(state || {}) };
  next.completedChapters = [...new Set(next.completedChapters)].filter(n => Number.isInteger(n) && n > 0 && n <= CONFIG.chapterCount).sort((a,b) => a-b);
  next.openedChapters = [...new Set([1, ...next.openedChapters])].filter(n => Number.isInteger(n) && n > 0 && n <= CONFIG.chapterCount).sort((a,b) => a-b);
  next.foundSecrets = [...new Set(next.foundSecrets)];
  next.introSurvey = { answers: {}, completed: false, ...(next.introSurvey || {}) };
  next.introSurvey.answers = typeof next.introSurvey.answers === 'object' && next.introSurvey.answers ? next.introSurvey.answers : {};
  next.introSurvey.completed = Boolean(next.introSurvey.completed);
  for (const key of ['receivedEnvelopes', 'openedEnvelopes', 'continuedEnvelopes', 'rewards']) {
    next[key] = [...new Set(next[key] || [])].filter(n => Number.isInteger(n) && n > 0 && n <= CONFIG.chapterCount).sort((a,b) => a-b);
  }
  // Пройденные в старых сохранениях главы получают конверты, но не открывают новые обходным путём.
  next.completedChapters.forEach(number => {
    if (!next.receivedEnvelopes.includes(number)) next.receivedEnvelopes.push(number);
    if (!next.openedEnvelopes.includes(number)) next.openedEnvelopes.push(number);
    if (!next.continuedEnvelopes.includes(number)) next.continuedEnvelopes.push(number);
  });
  // Без завершённого опроса первая глава остаётся обязательной точкой входа.
  if (!next.introSurvey.completed) {
    next.completedChapters = [];
    next.openedChapters = [1];
    next.receivedEnvelopes = [];
    next.openedEnvelopes = [];
    next.continuedEnvelopes = [];
    next.rewards = [];
  } else {
    let lastCompleted = 0;
    while (next.completedChapters.includes(lastCompleted + 1) && next.continuedEnvelopes.includes(lastCompleted + 1)) lastCompleted += 1;
    next.completedChapters = next.completedChapters.filter(number => number <= lastCompleted);
    next.openedChapters = Array.from({ length: Math.min(CONFIG.chapterCount, lastCompleted + 1) }, (_, index) => index + 1);
  }
  next.music = { ...DEFAULT_STATE.music, ...next.music, volume: Math.max(0, Math.min(1, Number(next.music?.volume ?? CONFIG.music.defaultVolume))) };
  next.gameResults = typeof next.gameResults === 'object' && next.gameResults ? next.gameResults : {};
  next.totalProgress = Math.round((next.completedChapters.length / CONFIG.chapterCount) * 100);
  return next;
}
export function loadProgress() { try { const current=localStorage.getItem(CONFIG.storageKey); const legacy=current??localStorage.getItem(CONFIG.legacyStorageKey); const state=normalise(JSON.parse(legacy)); if(!current&&legacy)localStorage.setItem(CONFIG.storageKey,JSON.stringify(state)); return state; } catch { return cloneDefaultState(); } }
export function saveProgress(state) { const safe = normalise(state); localStorage.setItem(CONFIG.storageKey, JSON.stringify(safe)); return safe; }
export function resetProgress() { localStorage.removeItem(CONFIG.storageKey); localStorage.removeItem(CONFIG.legacyStorageKey); return cloneDefaultState(); }
export function isChapterOpen(state, chapterNumber) { return state.openedChapters.includes(chapterNumber); }
export function awardEnvelope(state, chapterNumber) {
  if (!isChapterOpen(state, chapterNumber) || (chapterNumber === 1 && !state.introSurvey?.completed)) return normalise(state);
  return saveProgress({ ...state, receivedEnvelopes: [...state.receivedEnvelopes, chapterNumber], rewards: [...state.rewards, chapterNumber] });
}
export function openEnvelope(state, chapterNumber) {
  if (!state.receivedEnvelopes.includes(chapterNumber)) return normalise(state);
  return saveProgress({ ...state, openedEnvelopes: [...state.openedEnvelopes, chapterNumber] });
}
export function continueFromEnvelope(state, chapterNumber) {
  if (!state.receivedEnvelopes.includes(chapterNumber) || !state.openedEnvelopes.includes(chapterNumber) || (chapterNumber === 1 && !state.introSurvey?.completed)) return normalise(state);
  const completed = [...state.completedChapters, chapterNumber];
  const opened = [...state.openedChapters, ...(chapterNumber < CONFIG.chapterCount ? [chapterNumber + 1] : [])];
  return saveProgress({ ...state, completedChapters: completed, openedChapters: opened, continuedEnvelopes: [...state.continuedEnvelopes, chapterNumber] });
}
/** Совместимость с ранним API: завершение возможно только после открытого конверта. */
export function completeChapter(state, chapterNumber) { return continueFromEnvelope(state, chapterNumber); }
export function saveMusicSettings(state, music) { return saveProgress({ ...state, music: { ...state.music, ...music } }); }
export function saveGameResult(state, gameId, result) { return saveProgress({ ...state, gameResults: { ...state.gameResults, [gameId]: result } }); }
export function addSecret(state, secretId) { return saveProgress({ ...state, foundSecrets: [...state.foundSecrets, secretId] }); }
export function saveIntroSurvey(state, answers, completed = false) { return saveProgress({ ...state, introSurvey: { answers: { ...answers }, completed } }); }
