import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPublicationPage } from './view-publication.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPublicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPublicationPageRoutingModule {}
