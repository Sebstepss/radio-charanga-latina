import { Injectable } from '@angular/core';
import { Firestore, collectionData, addDoc, collection, query, orderBy, limit, startAfter, Timestamp, where, updateDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Comment {
  id?: string;
  name: string;
  avatar: string;
  content: string;
  timestamp: Timestamp;
  isExpress: boolean;
  reported?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentsRef = collection(this.firestore, 'comments');

  constructor(private firestore: Firestore) {}

  addComment(comment: Comment): Promise<any> {
    return addDoc(this.commentsRef, {
      ...comment,
      timestamp: Timestamp.now()
    });
  }

  getComments(lastVisible: any = null): Observable<Comment[]> {
    let q = query(this.commentsRef, orderBy('timestamp', 'desc'), limit(10));
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    return collectionData(q, { idField: 'id' }).pipe(
      map(comments => comments as Comment[])
    );
  }

  getCommentsRealTime(): Observable<Comment[]> {
    const q = query(this.commentsRef, orderBy('timestamp', 'desc'), limit(10));
    return collectionData(q, { idField: 'id' }).pipe(
      map(comments => comments as Comment[])
    );
  }

  reportComment(commentId: string): Promise<void> {
    const commentDocRef = doc(this.firestore, `comments/${commentId}`);
    return updateDoc(commentDocRef, { reported: true });
  }
}
