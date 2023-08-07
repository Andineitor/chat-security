import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  collection = 'publicacion';
  comments = 'comentarios';
  reactions = 'like';

  private publication: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) {
    this.publication = this.firestore.collection<any>(this.collection);
  }

  getAllsPublications() {
    return this.firestore.collection(this.collection).snapshotChanges().pipe(
      map((actions: DocumentChangeAction<any>[]) => {
        return actions.map((action: DocumentChangeAction<any>) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          const date = (data.fecha).toDate();
          let meses: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
          const time = `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}, ${date.getHours()}:${(date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes()}`;
          return { id, ...data, time };
        });
      })
    );
  }

  getAllsComments() {
    return this.firestore.collection(this.comments).snapshotChanges().pipe(
      map((actions: DocumentChangeAction<any>[]) => {
        return actions.map((action: DocumentChangeAction<any>) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAllsReactions() {
    return this.firestore.collection(this.reactions).snapshotChanges().pipe(
      map((actions: DocumentChangeAction<any>[]) => {
        return actions.map((action: DocumentChangeAction<any>) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
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

  deleteReaction(reactionId: any) {
    return this.firestore.collection(this.reactions).doc(reactionId).delete();
  }

  createReaction(data: any) {
    return this.firestore.collection(this.reactions).add(data);
  }

}
