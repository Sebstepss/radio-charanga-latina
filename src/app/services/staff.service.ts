import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface StaffMember {
  id: string;
  cargo: string;
  nombre: string;
  foto: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(private firestore: Firestore) {}

  getStaff(): Observable<StaffMember[]> {
    const staffCollection = collection(this.firestore, 'staff');
    return collectionData(staffCollection, { idField: 'id' }) as Observable<StaffMember[]>;
  }
}

