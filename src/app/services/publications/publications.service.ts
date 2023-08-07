import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  collection = 'publicacion';

  private publication: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) {
    this.publication = this.firestore.collection<any>(this.collection);
  }

  getAllsPublications() {
    return this.firestore.collection(this.collection).valueChanges();
  }

  getPublicationsByUSer(userID: string) {
    return this.publication.ref.where('user_id', '==', userID)
      .get()
      .then((querySnapshot: QuerySnapshot<any>) => {
        return querySnapshot.docs.map(doc => doc.data());
      });
  }

  createPublicaction(data: any) {
    return this.firestore.collection(this.collection).add(data);
  }

}
