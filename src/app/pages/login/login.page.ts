import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  isTypePasswordisLogin: boolean = true;
  isLogin = false;
  isTypePassword: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.initForm();
  }

  ngOnInit(): void { }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit() {
    if (!this.form.valid) return;
    console.log(this.form.value);
    this.login(this.form);
  }

  login(form) {
    this.authService
      .login(form.value.email, form.value.password)
      .then((data) => {
        this.authService.getUserByUID(this.authService.getID()).subscribe({
          next: result => {
            this.authService.saveName(result.name);
            this.authService.savePhoto(result.photo);
          },
          error: e => console.log(e)
        });
        this.router.navigateByUrl('/home');
        form.reset();
      })
      .catch((e) => {
        console.log(e);
        let msg = 'No se pudo iniciar sesión, inténtalo de nuevo';
        if (e.code == 'auth/user-not-found') msg = 'No se pudo encontrar la dirección de correo electrónico';
        else if (e.code == 'auth/wrong-password') msg = 'Por favor ingrese una contraseña correcta';
        this.showAlert(msg);
      });
  }

  async showAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Mensaje importante',
      message: msg,
      buttons: ['Wueno'],
    });

    await alert.present();
  }
}
