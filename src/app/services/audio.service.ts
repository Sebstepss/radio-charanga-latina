import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement;
  private playingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.playingSubject.asObservable();

  constructor() {
    this.audio = new Audio('https://sonic.portalfoxmix.club/8046/stream');
    this.audio.preload = 'none';

    // Configurar eventos de audio
    this.audio.addEventListener('play', () => {
      this.playingSubject.next(true);
      this.enableBackgroundAudio();
    });

    this.audio.addEventListener('pause', () => {
      this.playingSubject.next(false);
      this.disableBackgroundAudio();
    });
  }

  togglePlayPause() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  private play() {
    this.audio.play().catch(error => console.error('Error al reproducir:', error));
  }

  private pause() {
    this.audio.pause();
  }

  private enableBackgroundAudio() {
    if (Capacitor.isNativePlatform()) {
      // Código específico para plataformas nativas (Android/iOS)
      // Aquí puedes agregar lógica adicional si es necesario
    }
  }

  private disableBackgroundAudio() {
    if (Capacitor.isNativePlatform()) {
      // Código específico para plataformas nativas (Android/iOS)
      // Aquí puedes agregar lógica adicional si es necesario
    }
  }
}
