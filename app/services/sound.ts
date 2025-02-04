// 音效类型枚举
export type SoundType = 
  | 'taskComplete' 
  | 'medalUnlock' 
  | 'taskFail';

// 音效管理类
class SoundService {
  private sounds: { [key in SoundType]?: HTMLAudioElement } = {};
  private isMuted: boolean = false;

  constructor() {
    // 初始化音效
    this.sounds = {
      taskComplete: new Audio('/sounds/task-complete.mp3'),
      medalUnlock: new Audio('/sounds/medal-unlock.mp3'),
      taskFail: new Audio('/sounds/task-fail.mp3'),
    };

    // 从 localStorage 读取静音状态
    const storedMute = localStorage.getItem('isMuted');
    this.isMuted = storedMute === 'true';
  }

  play(type: SoundType) {
    if (this.isMuted || !this.sounds[type]) return;

    // 停止当前正在播放的音效
    this.sounds[type]?.pause();
    this.sounds[type]!.currentTime = 0;
    
    // 播放新的音效
    this.sounds[type]?.play().catch(error => {
      console.error('播放音效失败:', error);
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('isMuted', String(this.isMuted));
  }

  getMuteStatus() {
    return this.isMuted;
  }
}

// 导出单例
export const soundService = new SoundService(); 