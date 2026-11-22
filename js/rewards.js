import { getEnvelope } from '../data/envelopes.js';
import { getLetterPhoto } from '../data/photos.js';

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

/** Показывает награду и передаёт продолжение только после открытия конверта. */
export function showChapterEnvelope(container, chapterNumber, { onOpen, onContinue }) {
  const envelope = getEnvelope(chapterNumber);
  const photo = getLetterPhoto(chapterNumber);
  const hasText = Boolean(envelope.title || envelope.message);
  const hasPhoto = Boolean(photo?.enabled && photo.src);

  container.innerHTML = `<section class="reward-overlay" aria-labelledby="reward-title">
    <div class="reward-overlay__sparkles" aria-hidden="true">✦ ♥ ✦</div>
    <p class="eyebrow">НАГРАДА ПОЛУЧЕНА · КОНВЕРТ ${envelope.number}</p>
    <h2 id="reward-title">Для тебя есть маленький подарок</h2>
    <button class="reward-envelope" id="reward-envelope" type="button" aria-label="Открыть конверт ${envelope.number}">
      <span class="reward-envelope__flap"></span><span class="reward-envelope__seal">♥</span><span>Конверт ${envelope.number}</span>
    </button>
    <article class="reward-letter" id="reward-letter" hidden>
      ${hasText ? `<p class="eyebrow">ЛИЧНОЕ ПОСЛАНИЕ</p><h3>${escapeHtml(envelope.title)}</h3><p>${escapeHtml(envelope.message)}</p>` : ''}
      ${hasPhoto ? `<figure><img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.caption || `Фотография к конверту ${envelope.number}`)}"><figcaption>${escapeHtml(photo.caption)}</figcaption></figure>` : ''}
      <button class="button button--primary" id="reward-continue" type="button">Продолжить →</button>
    </article>
  </section>`;

  const envelopeButton = container.querySelector('#reward-envelope');
  const letter = container.querySelector('#reward-letter');
  envelopeButton.addEventListener('click', () => {
    if (envelopeButton.classList.contains('is-open')) return;
    envelopeButton.classList.add('is-open');
    window.setTimeout(() => { letter.hidden = false; onOpen(); }, 500);
  });
  container.querySelector('#reward-continue').addEventListener('click', onContinue);
}
