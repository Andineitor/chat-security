import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getDoc, DocumentReference, DocumentSnapshot } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public _uid = new BehaviorSubject<any>(null);
  currentUser: any;

  constructor(
    private fireAuth: AngularFireAuth,
    private apiService: ApiService
  ) {}

  getId() {
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    console.log(this.currentUser);
    return this.currentUser?.uid;
  }

  // Login
  async login(email: string, password: string): Promise<any> {
    try {
      const auth = getAuth(); // Get the instance of FirebaseAuth
      const response = await signInWithEmailAndPassword(auth, email, password);

      console.log(response);
      if (response?.user) {
        this.setUserData(response.user.uid);
      }
    } catch (e) {
      throw e;
    }
  }

  setUserData(uid: string): void {
    this._uid.next(uid);
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + max);
  }

  async register(formValue) {
    try {
      const auth = getAuth(); // Get the instance of FirebaseAuth
      const registeredUser = await createUserWithEmailAndPassword(
        auth,
        formValue.email,
        formValue.password
      );
      const data = {
        email: formValue.email,
        name: formValue.username,
        uid: registeredUser.user.uid,
        photo: 'https://i.pravatar.cc/' + this.randomIntFromInterval(200, 400)
      };
      await this.apiService.setDocument(`users/${registeredUser.user.uid}`, data);
      const userData = {
        id: registeredUser.user.uid
      };
      return userData;
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(email: string) {
    try {
      const auth = getAuth(); // Get the instance of FirebaseAuth
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      throw e;
    }
  }

  async logout() {
    try {
      await this.fireAuth.signOut();
      this._uid.next(null);
      return true;
    } catch (e) {
      throw e;
    }
  }

  checkAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      const auth = getAuth(); // Get the instance of FirebaseAuth
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log('auth user: ', user);
        resolve(user);
      });

      // Return the unsubscribe function to clean up the listener
      return unsubscribe;
    });
  }

  async getUserData(id) {
    const docSnap: DocumentSnapshot<any> = await this.apiService.getDocById(`user/${id}`);
    if (docSnap?.exists()) {
      return docSnap.data();
    } else {
      throw new Error('No existe el documento');
    }
  }

  async getDocById(path): Promise<DocumentSnapshot<any>> {
    const dataRef = this.docRef(path);
    if (dataRef) {
      return getDoc(dataRef);
    } else {
      throw new Error('Referencia de documento inválida');
    }
  }

  private docRef(path): DocumentReference<unknown> | null {
    // Return your Firestore document reference here
    return null;
  }
}
