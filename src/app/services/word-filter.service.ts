import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordFilterService {
  private words: string[] = [];
  private wordsLoaded = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadWords().subscribe();
  }

  loadWords(): Observable<string[]> {
    return this.http.get<string[]>('/assets/offensive-words.json').pipe(
      tap(words => {
        this.setWords(words);
        this.wordsLoaded.next(true);
      })
    );
  }

  isTextOffensive(text: string): boolean {
    if (!this.wordsLoaded.getValue()) {
      console.warn('Las palabras ofensivas aún no se han cargado.');
      return false;
    }
    const lowerCaseText = text.toLowerCase();
    return this.words.some(word => lowerCaseText.includes(word));
  }

  setWords(words: string[]): void {
    this.words = words;
  }

  wordsLoadedStatus(): Observable<boolean> {
    return this.wordsLoaded.asObservable();
  }
}

