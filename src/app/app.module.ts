import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { getApp, initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent],
  imports: [    ReactiveFormsModule, BrowserModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyC8NkXjDCbvBBpepI_x0gUz_TTAFLE-zBU",
      authDomain: "social-media-2865f.firebaseapp.com",
      projectId: "social-media-2865f",
      storageBucket: "social-media-2865f.appspot.com",
      messagingSenderId: "188033546892",
      appId: "1:188033546892:web:afb06b0bb3632672ced9a9"
    }),
    AngularFireAuthModule, BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule, provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyC8NkXjDCbvBBpepI_x0gUz_TTAFLE-zBU",
      authDomain: "social-media-2865f.firebaseapp.com",
      projectId: "social-media-2865f",
      storageBucket: "social-media-2865f.appspot.com",
      messagingSenderId: "188033546892",
      appId: "1:188033546892:web:afb06b0bb3632672ced9a9"
    })),
     provideAuth(() =>{
      if (Capacitor.isNativePlatform()){
      return initializeAuth(getApp(),{
        persistence: indexedDBLocalPersistence
      })
    }else{
      return getAuth()
    }
  }),
     
     provideFirestore(() => getFirestore())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
