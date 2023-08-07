import { ApiService } from './../api/api.service';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public _uid = new BehaviorSubject<any>(null);
  currentUser: any;

  constructor(
    private fireAuth: Auth,
    private firestore: AngularFirestore,
    private apiService: ApiService
  ) { }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await signInWithEmailAndPassword(this.fireAuth, email, password);
      if(response?.user) {
        response.user.uid
        this.setUserData(response.user.uid);
        this.saveID(response.user.uid);
        console.log(response);
      } else{
      }
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  getUserByUID(userID: string): Observable<any> {
    const userDocRef: AngularFirestoreDocument<any> = this.firestore.collection('users').doc<any>(userID);
    return userDocRef.valueChanges();
  }

  getId() {
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    return this.currentUser?.uid;
  }

  setUserData(uid) {
    this._uid.next(uid);
  }

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async register(formValue) {
    try {
      const registeredUser = await createUserWithEmailAndPassword(this.fireAuth, formValue.email, formValue.password);
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
    } catch(e) {
      throw(e);
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.fireAuth, email);
    } catch(e) {
      throw(e);
    }
  }

  async logout() {
    try {
      await this.fireAuth.signOut();
      this._uid.next(null);
      this.currentUser = null;
      return true;
    } catch(e) {
      throw(e);
    }
  }

  checkAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.fireAuth, user => {
        console.log('auth user: ', user);
        resolve(user)
      });
    });
  }

  async getUserData(id) {
    const docSnap: any = await this.apiService.getDocById(`users/${id}`);
      if(docSnap?.exists()) {
        return docSnap.data();
      } else {
        throw('No such document exists');
      }
  }

  saveName(name:any){
    localStorage.setItem('name',name);
  }

  saveID(id:any){
    localStorage.setItem('user_id',id);
  }

  savePhoto(name:any){
    localStorage.setItem('photo',name);
  }

  getID(){
    return localStorage.getItem('user_id');
  }

  getName(){
    return localStorage.getItem('name');
  }

  getPhoto(){
    return localStorage.getItem('photo');
  }




  

}
