import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PublicationsService } from 'src/app/services/publications/publications.service';

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.page.html',
  styleUrls: ['./create-publication.page.scss'],
})
export class CreatePublicationPage implements OnInit {

  form: FormGroup = this.fb.group({
    user_id: [this.authService.getID()],
    fecha: [new Date(), [Validators.required]],
    texto: ['', [Validators.required]],
    user_photo: [this.authService.getPhoto()],
    name_user:[this.authService.getName()]
  });

  constructor(public authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private publicationsService: PublicationsService,
    private fb: FormBuilder) { }

  ngOnInit() {

  }

  create() {
    this.form.patchValue({ fecha: new Date() });
    this.publicationsService.createPublicaction(this.form.value).then(async (docRef) => {
      const alert = await this.alertController.create({
        header: 'Exitó!!',
        subHeader: 'Haz realizado una publicación',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigateByUrl('home');
    })
      .catch(async (error) => {
        const alert = await this.alertController.create({
          header: 'Error!!',
          subHeader: 'Intenta nuevamente',
          message: error,
          buttons: ['OK'],
        });
        await alert.present();
      });
  }

}
