import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
//import { addDoc } from '@angular/fire/firestore/firebase';
import { addDoc, collectionData, docData, getDocs, orderBy } from '@angular/fire/firestore';
import { DocumentData, DocumentReference } from '@firebase/firestore-types';
import firebase from 'firebase/compat';
import { OrderByDirection, collection, getDoc, query, where } from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(
    private firestore: AngularFirestore
  ) { }

  docRef(path: string): firebase.firestore.DocumentReference {
    return this.firestore.firestore.doc(path); // Use 'this.firestore.firestore.doc()' method instead of 'doc()' from 'firebase/firestore'
  }

  collectionRef(path) {
    return collection(this.firestore.firestore, path);
  }

  setData(dataRef: firebase.firestore.DocumentReference, data: any): Promise<void> {
    return dataRef.set(data); // Use 'set()' method directly on the document reference
  }
  setDocument(path: string, data: any) {
    const dataRef = this.docRef(path);
    return dataRef.set(data);
  }

  addDocument(path, data) {
    const dataRef = this.collectionRef(path);
    return addDoc<any>(dataRef, data);
  }

  getDocById(path: string, ) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }

  getDocs(path, queryFn){
    let dataRef: any = this.collectionRef(path);
    if(queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    return getDocs<any>(dataRef);
  }

  collectionDataQuery(path, queryFn?) {
    let dataRef: any = this.collectionRef(path);
    if(queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    // let collection_data;
    // if(id) collection_data = collectionData<any>(dataRef, {idField: 'id'});
    const collection_data = collectionData<any>(dataRef, {idField: 'id'});
    return collection_data
  }

  docDataQuery(path, id?, queryFn?) {
    let dataRef: any = this.docRef(path);
    if(queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    let doc_data;
    if(id) doc_data = docData<any>(dataRef, {idField: 'id'});
    else doc_data = docData<any>(dataRef);
    return doc_data
  }

  whereQuery(fieldPath, condition, value) {
    return where(fieldPath, condition, value)
  }

  orderByQuery(fieldPath, directionStr: OrderByDirection = 'asc' ) {
    return orderBy(fieldPath, directionStr)
  }
}
