import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsRef = collection(this.firestore, 'clientes');

  constructor(private firestore: Firestore) {}

  getClients(): Observable<Client[]> {
    return collectionData(this.clientsRef, { idField: 'id' }) as Observable<Client[]>;
  }
}

export interface Client {
  id?: string;
  Nombre: string;
  Logo: string;
  Ads: string;
  Link: string;
}