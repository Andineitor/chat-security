import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePublicationPage } from './create-publication.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePublicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePublicationPageRoutingModule {}
