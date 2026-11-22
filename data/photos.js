/**
 * Единый реестр личных фотографий.
 * После добавления файла в assets/photos/ установите enabled: true.
 * Это исключает запросы к ещё не добавленным файлам и связанные с ними 404.
 */
const chapterPhoto = number => ({
  id: `chapter-${String(number).padStart(2, '0')}`,
  src: `assets/photos/chapter-${String(number).padStart(2, '0')}.jpg`,
  caption: '',
  enabled: false
});

const letterPhoto = number => ({
  id: `letter-${String(number).padStart(2, '0')}`,
  src: `assets/photos/letter-${String(number).padStart(2, '0')}.jpg`,
  caption: '',
  enabled: false
});

export const chapterPhotos = Array.from({ length: 20 }, (_, index) => chapterPhoto(index + 1));
chapterPhotos[12] = { ...chapterPhotos[12], caption: 'Собери наш кадр.', enabled: true };

const rewardCaptions = [
  'Тот день, когда всё было особенно красиво.',
  'Тёплый момент рядом.',
  'Цветы, вечер и мы.',
  'Самое важное фото — вместе.',
  'Ты и твои прекрасные розы.',
  'Наши школьные дни.',
  'Улыбка, цветы и ты.',
  'Наш день в городе.',
  'Дорога вместе.',
  'Твоя нежность в одном кадре.',
  'Самое главное — быть рядом.',
  'Любимые напитки и один общий момент.',
  'Вечерняя прогулка.',
  'Тёплый кадр в дороге.',
  'По дороге вместе.',
  'Ты прекрасна в каждом моменте.',
  'Вкусный вечер.',
  'Розы для тебя, Диляфруз.',
  'Цветы и наше время.',
  'Закат, который останется с нами.'
];
export const letterPhotos = Array.from({ length: 20 }, (_, index) => ({
  ...letterPhoto(index + 1), caption: rewardCaptions[index], enabled: true
}));

/** Общая галерея: добавляйте элементы только для готовых файлов. */
export const galleryPhotos = [];

/** Главная фотография секретной комнаты и изображения финала. */
export const specialPhotos = {
  secretRoom: { src: 'assets/photos/secret-room.jpg', caption: '', enabled: false },
  finale: [
    { src: 'assets/photos/finale-01.jpg', caption: 'Наш вечер вместе.', enabled: true },
    { src: 'assets/photos/finale-02.jpg', caption: 'Ты и я — рядом.', enabled: true },
    { src: 'assets/photos/finale-03.jpg', caption: 'Моя прекрасная Диляфруз.', enabled: true }
  ]
};

export function getChapterPhoto(number) { return chapterPhotos[number - 1]; }
export function getLetterPhoto(number) {
  const photo = letterPhotos[number - 1];
  return photo?.enabled ? photo : getChapterPhoto(number);
}
