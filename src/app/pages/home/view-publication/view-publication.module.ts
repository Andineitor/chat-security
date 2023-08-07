import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPublicationPageRoutingModule } from './view-publication-routing.module';

import { ViewPublicationPage } from './view-publication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPublicationPageRoutingModule
  ],
  declarations: [ViewPublicationPage]
})
export class ViewPublicationPageModule {}
