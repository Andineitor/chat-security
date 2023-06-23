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


@NgModule({
  declarations: [AppComponent],
  imports: [    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule, BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule, provideFirebaseApp(() => initializeApp(environment.firebase)),
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
