import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private publicacionesCollection: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) {
    this.publicacionesCollection = this.firestore.collection<any>('publicacion');
  }

  getPublicacionesPorUsuario(userID: string) {
    return this.publicacionesCollection.ref.where('user_id', '==', userID)
      .get()
      .then((querySnapshot: QuerySnapshot<any>) => {
        return querySnapshot.docs.map(doc => doc.data());
      });
  }

}
