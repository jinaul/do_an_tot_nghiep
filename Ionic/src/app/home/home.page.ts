import { Component } from '@angular/core';

import * as firebase from 'firebase';

import { WindowService } from '../window.service';

export class PhoneNumber {
  country: string;
  number: string
  get e164() {
    const num = this.country + this.number;
    return `+${num}`
  }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  number;
  windowRef: any;
  phoneNumber = new PhoneNumber;
  verificationCode: string;
  user: any;

  constructor(private win: WindowService) {}

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
  }

  sendCode() {
    this.phoneNumber.country = '+84';
    this.phoneNumber.number = this.number;
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier).then(result => {
      this.windowRef.confirmationResult = result;
    }).catch(error => {
      alert(error);
      this.phoneNumber.country = null;
      this.phoneNumber.number = null;
    });
  }

  verifiCode() {
    var check = 0;
    var number = '';
    this.windowRef.confirmationResult.confirm(this.verificationCode).then(result => {
      this.user = result.user;
      number = '0' + this.user.phoneNumber.slice(3);
      alert(number);
    }).catch(error => {
      alert(error);
      this.verificationCode = null;
    });
  }

}
