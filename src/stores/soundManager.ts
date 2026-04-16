import { resolvePath } from '../utils/paths';

const soundUrls = {
  bgSound: resolvePath('/sound/bgSound.mp3'),
  effects: {
    pickUp: resolvePath('/sound/sfx/pickUp.m4a'),
    towerUpgrade: resolvePath('/sound/sfx/towerUpgrade.m4a'),
    clickEnemy: resolvePath('/sound/sfx/clickEnemy.m4a'),
    towerShoot: resolvePath('/sound/sfx/towerShoot.m4a'),
    clickMenu: resolvePath('/sound/sfx/clickMenu.m4a'),
    lowResourse: resolvePath('/sound/sfx/lowResourse.m4a'),
    shine: resolvePath('/sound/sfx/shine.mp3'),
    chime: resolvePath('/sound/sfx/chime.mp3'),
    magicBurst: resolvePath('/sound/sfx/magic-burst.mp3'),
    break: resolvePath('/sound/sfx/break-sound.mp3'),
    destruction: resolvePath('/sound/sfx/destruction-sound.mp3')
  }
};

const MUSIC_VOLUME = 0.2;
const SFX_VOLUME = 0.3;

export class SoundManager {
  sounds: Record<string, HTMLAudioElement | undefined> = {};
  isMuted = false;
  playingEffectsCount = 0;

  audioContext: AudioContext | null = null;
  bgNode: MediaElementAudioSourceNode | null = null;
  bgFilter: BiquadFilterNode | null = null;

  preloaded = false;
  loadedCount = 0;

  get totalResources() {
    return Object.keys(soundUrls.effects).length + 1;
  }

  get preloadPercent() {
    return Math.min(Math.floor((this.loadedCount / this.totalResources) * 100), 100);
  }

  async preload() {
    const loadSound = (name: string, url: string) => {
      return new Promise<void>((resolve) => {
        const audio = new Audio(url);

        const onLoad = () => {
          this.sounds[name] = audio;
          this.sounds[name]!.volume = name === 'bgSound' ? MUSIC_VOLUME : SFX_VOLUME;
          if (name === 'bgSound') this.sounds[name]!.loop = true;
          this.loadedCount += 1;
          audio.removeEventListener('canplaythrough', onLoad);
          resolve();
        };

        const onError = () => {
          console.warn(`Failed to load sound: ${name}`);
          this.loadedCount += 1;
          audio.removeEventListener('error', onError);
          resolve();
        };

        audio.addEventListener('canplaythrough', onLoad);
        audio.addEventListener('error', onError);
        audio.load();
        
        setTimeout(() => {
          this.loadedCount += 1;
          resolve();
        }, 3000);
      });
    };

    try {
      await loadSound('bgSound', soundUrls.bgSound);
      const effectPromises = Object.entries(soundUrls.effects).map(([name, url]) => loadSound(name, url));
      await Promise.all(effectPromises);
      this.preloaded = true;
      console.log('Sounds preloaded (some may have failed).');
    } catch (error) {
      console.warn('Error preloading sounds, continuing without:', error);
      this.preloaded = true;
    }
  }

  reduceBgVolume() {
    const bg = this.sounds['bgSound'];
    if (bg) bg.volume = MUSIC_VOLUME - 0.2;
  }

  restoreBgVolume() {
    const bg = this.sounds['bgSound'];
    if (bg) bg.volume = MUSIC_VOLUME;
  }

  initAudioContext() {
    if (this.audioContext) return;
    const AudioCtx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    this.audioContext = new AudioCtx();

    const bgSound = this.sounds['bgSound'];
    if (bgSound && this.audioContext) {
      this.bgNode = this.audioContext.createMediaElementSource(bgSound);
      this.bgFilter = this.audioContext.createBiquadFilter();

      this.bgFilter.type = 'lowpass';
      this.bgFilter.frequency.value = 22050;

      this.bgNode.connect(this.bgFilter);
      this.bgFilter.connect(this.audioContext.destination);
    }
  }

  play(name: string, isImportant = false) {
    if (this.isMuted) return;

    const audio = this.sounds[name];
    if (!audio) return;

    if (name === 'bgSound') {
      this.initAudioContext();
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
      }
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }

    // Disable sfx on Safari due to performance issues
    if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
      return;
    }

    if (isImportant || this.playingEffectsCount < 10) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      const onEnded = () => {
        this.playingEffectsCount -= 1;
        audio.removeEventListener('ended', onEnded);
      };
      audio.addEventListener('ended', onEnded);
      this.playingEffectsCount += 1;
    }
  }

  pause(name: string) {
    const audio = this.sounds[name];
    if (audio) audio.pause();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.pause('bgSound');
    } else {
      this.play('bgSound');
    }
  }

  reset() {
    if (this.isMuted) return;
    const bgSound = this.sounds['bgSound'];
    if (bgSound) {
      bgSound.currentTime = 0;
      bgSound.volume = MUSIC_VOLUME;
      bgSound.play().catch(() => {});
    }
  }

  setDistortion(enable: boolean) {
    if (!this.bgFilter || !this.audioContext) return;

    const currentTime = this.audioContext.currentTime;
    const targetFreq = enable ? 600 : 22050;

    this.bgFilter.frequency.cancelScheduledValues(currentTime);
    this.bgFilter.frequency.exponentialRampToValueAtTime(targetFreq, currentTime + 0.5);
  }
}

export const soundManager = new SoundManager();
