import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { getDoc, DocumentSnapshot } from 'firebase/firestore';
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
    private apiService: ApiService,
  ) { }

  getId(): string | undefined {
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    console.log(this.currentUser);
    return this.currentUser?.uid;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response: UserCredential = await signInWithEmailAndPassword(this.fireAuth, email, password);
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

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + max);
  }

  async register(formValue): Promise<any> {
    try {
      const registeredUser: UserCredential = await createUserWithEmailAndPassword(this.fireAuth, formValue.email, formValue.password);
      const data = {
        email: formValue.email,
        name: formValue.username,
        uid: registeredUser.user?.uid,
        photo: 'https://i.pravatar.cc/' + this.randomIntFromInterval(200, 400)
      };
      await this.apiService.setDocument(`users/${registeredUser.user?.uid}`, data);
      const userData = {
        id: registeredUser.user?.uid
      };
      return userData;
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.fireAuth, email);
    } catch (e) {
      throw e;
    }
  }

  async logout(): Promise<boolean> {
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
      onAuthStateChanged(this.fireAuth, user => {
        console.log('auth user: ', user);
        resolve(user);
      });
    });
  }

  async getUserData(id: string): Promise<any> {
    const docSnap: DocumentSnapshot<any> = await this.apiService.getDocById(`users/${id}`);
    if (docSnap?.exists()) {
      return docSnap.data();
    } else {
      throw new Error('no existe el documento');
    }
  }

  getDocById(path: string) {
    return this.apiService.docRef(path);
  }
}
