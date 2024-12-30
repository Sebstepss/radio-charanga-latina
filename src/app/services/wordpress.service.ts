import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordPressService {
  private baseUrl = 'https://charangalatina.cl/wp-json/wp/v2';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts?per_page=6`).pipe(
      switchMap((posts: any[]) => {
        const mediaRequests = posts.map(post =>
          this.http.get<any>(`${this.baseUrl}/media/${post.featured_media}`).pipe(
            map((media: any) => {
              post.featured_media_url = media.source_url;
              return post;
            })
          )
        );
        return forkJoin(mediaRequests);
      })
    );
  }

  getPost(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/posts/${id}`).pipe(
      switchMap((post: any) =>
        this.http.get<any>(`${this.baseUrl}/media/${post.featured_media}`).pipe(
          map((media: any) => {
            post.featured_media_url = media.source_url;
            return post;
          })
        )
      )
    );
  }
}
