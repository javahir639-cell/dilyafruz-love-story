import { CONFIG } from './config.js';
/** Единый аудиоменеджер: запросов к отсутствующим файлам не выполняет. */
export class AudioManager {
  constructor(element,onSettingsChange,notify){this.audio=element;this.onSettingsChange=onSettingsChange;this.notify=notify}
  applySettings(settings){this.audio.volume=settings.volume}
  async toggle(settings){return this.audio.paused?this.play(settings,'main'):(this.pause(),false)}
  async play(settings,track='main'){if(!CONFIG.availableTracks.includes(track)){this.notify('Музыка будет доступна после добавления файла и имени трека в config.js.');return false}this.audio.src=CONFIG.tracks[track]||CONFIG.music.src;this.audio.volume=0;try{await this.audio.play();await this.fadeTo(settings.volume);this.onSettingsChange({enabled:true});return true}catch{this.notify('Браузер не разрешил запустить музыку.');return false}}
  playTrack(track,settings){return this.play(settings,track)}
  pause(){this.audio.pause();this.onSettingsChange({enabled:false})}
  setVolume(value){this.audio.volume=value;this.onSettingsChange({volume:value})}
  fadeTo(target){return new Promise(resolve=>{const start=this.audio.volume,begin=performance.now(),tick=now=>{const ratio=Math.min(1,(now-begin)/CONFIG.music.fadeDuration);this.audio.volume=start+(target-start)*ratio;ratio<1?requestAnimationFrame(tick):resolve()};requestAnimationFrame(tick)})}
}
