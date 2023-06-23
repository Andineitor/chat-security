import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DocumentData, DocumentReference } from '@firebase/firestore-types';
import firebase from 'firebase/compat';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getDocById(arg0: string): import("@firebase/firestore").DocumentSnapshot<any> | PromiseLike<import("@firebase/firestore").DocumentSnapshot<any>> {
    throw new Error('Method not implemented.');
  }

  constructor(
    private firestore: AngularFirestore
  ) { }

  docRef(path: string): firebase.firestore.DocumentReference {
    return this.firestore.firestore.doc(path); // Use 'this.firestore.firestore.doc()' method instead of 'doc()' from 'firebase/firestore'
  }


  setData(dataRef: firebase.firestore.DocumentReference, data: any): Promise<void> {
    return dataRef.set(data); // Use 'set()' method directly on the document reference
  }
  setDocument(path: string, data: any) {
    const dataRef = this.docRef(path);
    return dataRef.set(data);
  }
}
