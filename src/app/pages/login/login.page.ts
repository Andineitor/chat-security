import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  isTypePassword: boolean = true;
  islogin = false;


  constructor() {
    this.initForm();
  }
  ngOnInit(): void {

  }
  initForm() {
    this.form = new FormGroup({

      email: new FormGroup('',
        { validators: [Validators.required, Validators.email] }),

      password: new FormControl('',
        { validators: [Validators.required, Validators.minLength(8)] }),


    })
  }


}