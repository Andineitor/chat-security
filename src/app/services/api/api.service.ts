import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { doc, DocumentData, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  docRef(path: string): DocumentReference<DocumentData> {
    return doc(this.firestore.firestore, path) as DocumentReference<DocumentData>;
  }

  setDocument(path: string, data: any) {
    const dataRef = this.docRef(path);
    return setDoc(dataRef, data);
  }
}
