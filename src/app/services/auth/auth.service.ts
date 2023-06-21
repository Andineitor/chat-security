import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { rejects } from 'assert';
import { randomInt } from 'crypto';
import { resolve } from 'dns';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { BehaviorSubject, max, min } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public _uid= new BehaviorSubject<any>(null);
  currentUser= any;

  constructor(
    private fireAuth: Auth,
private apiService: ApiService,
  ) { }


  //login
  async login(email: string, password:string): Promise<any>{
    try{
      const response= await signInWithEmailAndPassword(this.fireAuth, email, password);
      console.log(response);
      if(response?.user){
        this.setUserData(response.user.uid);
      }
      catch(e){
        throw(e);
      }
    }
  }
  setUserData(uid: string): void {
    throw new Error('Method not implemented.');
  }
}

getId(){
  const auth= getAuth();
  this.currentUser= auth.currentUser;
  console.log(this.currentUser);
  return this.currentUser?.uid;

}


setUserData(uid){
  this._uid.next(uid);
}

randomIntFromInterval(min, max){
  return Math.floor(Math.random()* (max-min+1)+max);
}


ansyc register(formValue){
  try{
    const registeredUser= await createUserWithEmailAndPassword(this.fireAuth, formValue.email,  
      formValue.password);
      const data={
        email: formValue.email,
        name: formValue.username,
        uid: fromValue.password,
        photo: 'https://i.pravatar.cc/'+ this.randomIntFromInterval(200, 400)
      };
await this.apoService.setDocument(`users/${registeredUser.user.uid}`, data);
const userData={
  id: registeredUser.user.id
};
return userData;
  }catch(e){
    throw(e);
  }
}

async resetPassword(email: string){
  try{
    await sendPasswordResetEmail(this.fireAuth, email);
  }catch(e){
    throw(e);
  }
}


async logout(){
  try{
    await this.fireAuth.signupOut();
    this._uid.next(null);
    return true;
  }catch(e){
    throw(e);
  }
}


checkAuth():Promise<any>{
  return new Promise((resolve, reject)=>{
    onAuthStateChanged(this.fireAuth, user => {
      console.log('auth user: ', user);
      resolve(user)
    });
  });
}


async getUserData(id){
  const docSnap: any= await this.apiService.getDocById(`user/${id}`);
  if(docSnap?.existss()){
    return docSnap.data();
  }else{
    throw('no existe el documento');
  }
}


