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
  private comentarios: AngularFirestoreCollection<any>;
  private reacciones: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) {
    this.publication = this.firestore.collection<any>(this.collection);
    this.comentarios = this.firestore.collection<any>(this.comments);
    this.reacciones = this.firestore.collection<any>(this.reactions);
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

  getPublication(id: any) {
    return this.firestore.collection(this.collection).doc(id).valueChanges();
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

  getCommentsByPublications(id: string) {
    return this.comentarios.ref.where('publicacion_id', '==', id)
      .get()
      .then((querySnapshot: QuerySnapshot<any>) => {
        const comentariosData = [];
        querySnapshot.forEach((doc) => {
          const comentario: any = doc.data();
          comentario.id = doc.id;
          comentariosData.push(comentario);
        });
        return comentariosData;
      });
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

  getReactionsByPublications(id: string) {
    return this.reacciones.ref.where('publicacion_id', '==', id)
      .get()
      .then((querySnapshot: QuerySnapshot<any>) => {
        const comentariosData = [];
        querySnapshot.forEach((doc) => {
          const comentario: any = doc.data();
          comentario.id = doc.id;
          comentariosData.push(comentario);
        });
        return comentariosData;
      });
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

  createComments(data: any) {
    return this.firestore.collection(this.comments).add(data);
  }

}
