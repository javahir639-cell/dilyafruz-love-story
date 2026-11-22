import { CONFIG } from './config.js';
import { loadProgress,resetProgress,saveMusicSettings,awardEnvelope,openEnvelope,continueFromEnvelope,saveIntroSurvey } from './progress.js';
import { renderChapters,openChapter } from './chapters.js';
import { AudioManager } from './audio.js';
import { createNavigation,setupSettings } from './navigation.js';
import { initialiseAmbientParticles } from './animations.js';
import { initialiseGallery } from './gallery.js';
import { initialiseSecretRoom } from './secret-room.js';
import { showChapterEnvelope } from './rewards.js';
const $=selector=>document.querySelector(selector);let progress=loadProgress(),toastTimer,audioManager;
const toast=message=>{const element=$('#toast');element.textContent=message;element.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove('is-visible'),3200)};
function updateProgress(){const complete=progress.completedChapters.length;$('#progress-text').textContent=`${complete} из ${CONFIG.chapterCount} глав`;$('#progress-fill').style.width=`${progress.totalProgress}%`;$('.progress-track').setAttribute('aria-valuenow',String(complete));$('#progress-caption').textContent=complete?`Сохранено ${progress.totalProgress}% нашей истории.`:'Первая глава ждёт своего момента.'}
function initialiseHeroClock(){const root=$('#hero-love-clock');if(!root||!CONFIG.relationshipStartDate)return;const values=[...root.querySelectorAll('b')];const tick=()=>{let left=Math.max(0,Date.now()-new Date(CONFIG.relationshipStartDate).getTime());const days=Math.floor(left/86400000);left%=86400000;const hours=Math.floor(left/3600000);left%=3600000;const minutes=Math.floor(left/60000);left%=60000;const seconds=Math.floor(left/1000);const milliseconds=left%1000;[days,hours,minutes,seconds,milliseconds].forEach((value,index)=>values[index].textContent=index?String(value).padStart(index===4?3:2,'0'):String(value))};tick();setInterval(tick,31)}
function closeChapter(){$('#chapter-stage').hidden=true;document.body.classList.remove('chapter-open');window.scrollTo({top:0,behavior:'smooth'})}
function showChapter(chapter){
  const stage=$('#chapter-stage');
  const showReward=number=>{
    progress=awardEnvelope(progress,number);
    showChapterEnvelope(stage,number,{
      onOpen:()=>{progress=openEnvelope(progress,number)},
      onContinue:()=>{progress=continueFromEnvelope(progress,number);render();closeChapter()}
    });
  };
  if(progress.receivedEnvelopes.includes(chapter.number)&&!progress.continuedEnvelopes.includes(chapter.number)){stage.hidden=false;document.body.classList.add('chapter-open');showChapterEnvelope(stage,chapter.number,{onOpen:()=>{progress=openEnvelope(progress,chapter.number)},onContinue:()=>{progress=continueFromEnvelope(progress,chapter.number);render();closeChapter()}});return}
  openChapter(chapter,stage,{complete:showReward,close:closeChapter,toast,playTrack:track=>audioManager.playTrack(track,progress.music),saveIntroSurvey:(answers,completed)=>{progress=saveIntroSurvey(progress,answers,completed)}})
}
function updateMusicUI(enabled){const button=$('#music-toggle');button.textContent=enabled?'♫':'♩';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Выключить музыку':'Включить музыку')}
function render(){renderChapters($('#chapter-grid'),progress,showChapter);updateProgress()}
function initialise(){document.querySelectorAll('[data-girl-name]').forEach(x=>x.textContent=CONFIG.girlName);const date=CONFIG.relationshipStartDate?new Intl.DateTimeFormat('ru-RU',{dateStyle:'long'}).format(new Date(CONFIG.relationshipStartDate)):'Наша история продолжается';$('#story [data-story-date]').textContent=date;initialiseHeroClock();audioManager=new AudioManager($('#background-audio'),changes=>{progress=saveMusicSettings(progress,changes);updateMusicUI(progress.music.enabled)},toast);audioManager.applySettings(progress.music);$('#volume').value=Math.round(progress.music.volume*100);$('#volume-value').textContent=`${$('#volume').value}%`;updateMusicUI(false);$('#music-toggle').onclick=()=>audioManager.toggle(progress.music);$('#volume').oninput=event=>{const v=Number(event.target.value)/100;$('#volume-value').textContent=`${event.target.value}%`;audioManager.setVolume(v)};setupSettings($('#settings-panel'),$('#settings-toggle'),$('#settings-close'));$('#reset-progress').onclick=()=>{if(!confirm('Сбросить весь сохранённый прогресс? Это действие нельзя отменить.'))return;progress=resetProgress();audioManager.pause();render();toast('Прогресс сброшен.')};createNavigation({intro:$('#intro'),story:$('#story'),openButtons:[$('#open-story'),$('#open-story-copy')],onOpen:()=>{render();scrollTo({top:0,behavior:'smooth'})}});initialiseAmbientParticles();initialiseGallery();initialiseSecretRoom()}
initialise();
