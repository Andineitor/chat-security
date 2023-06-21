import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc, } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private firestore: Firestore
  ) { }

docRef(path,){
  return doc(this.firestore, path)
}

setDocument(path, data){
  const dataRef = this this.docRef(path);
  return setDoc<any>(dataRef, data);
}

}
