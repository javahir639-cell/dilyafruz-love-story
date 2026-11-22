/** Центральные настройки: персональные данные можно менять только здесь. */
export const CONFIG = Object.freeze({
  girlName: 'Диляфруз', princessName: 'DILAFRUZ', authorName: '', relationshipStartDate: '2026-01-09T07:30:00', chapterCount: 20,
  finalRiddlePassword: 'DILAFRUZ I LOVE YOU', lettersToFind: 7, editMode: false,
  music: { src: 'assets/music/main-theme.mp3', defaultVolume: 0.45, fadeDuration: 850 },
  tracks: { main: 'assets/music/main-theme.mp3', memory: 'assets/music/memory-theme.mp3', game: 'assets/music/game-theme.mp3', finale: 'assets/music/finale-theme.mp3', secret: 'assets/music/secret-theme.mp3' },
  availableTracks: [],
  storageKey: 'dilafruz-love-story-v1',
  // Сохраняет накопленный прогресс посетителей после смены названия сайта.
  legacyStorageKey: ['dilya', 'fruz-love-story-v1'].join('')
});
