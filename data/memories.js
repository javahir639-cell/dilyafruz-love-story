/** Первые десять кадров разделены между двумя личными галереями. */
const captions = [
  'Цветы и маленький сюрприз.', 'Тёплый день рядом.', 'Наш момент в городе.',
  'Розы, которые останутся в памяти.', 'Ты и твои прекрасные розы.',
  'Школьное воспоминание.', 'Твоя улыбка и мои цветы.', 'Вечер в кафе.',
  'В дороге вместе.', 'Розы для тебя, Диляфруз.'
];
export const memories=Array.from({length:30},(_,index)=>({
  id:index+1, caption:captions[index]||'', note:'',
  photo:`assets/photos/photo${String(index+1).padStart(2,'0')}.jpg`, enabled:index<captions.length
}));
