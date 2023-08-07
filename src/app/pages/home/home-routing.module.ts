import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
//a
const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'chats/:id',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path: 'create-publication',
    loadChildren: () => import('./create-publication/create-publication.module').then(m => m.CreatePublicationPageModule)
  },
  {
    path: 'view-publication/:id',
    loadChildren: () => import('./view-publication/view-publication.module').then(m => m.ViewPublicationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
