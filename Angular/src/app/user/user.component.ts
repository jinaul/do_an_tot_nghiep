import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase';

import { WindowService } from '../window.service';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

import { Router } from '@angular/router'
import { combineLatest } from 'rxjs';

export class PhoneNumber {
  country: string;
  number: string
  get e164() {
    const num = this.country + this.number;
    return `+${num}`
  }
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  number;
  windowRef: any;
  phoneNumber = new PhoneNumber;
  verificationCode: string;
  user: any;
  orderform;

  trees;

  items = [];
  showsearch = false;

  constructor(private win: WindowService, private storage: AngularFireStorage, private db: AngularFireDatabase, private route: Router) {
    this.f_tree();
  }

  ngOnInit(): void {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
    this.db.list('orderform').valueChanges().subscribe(data => {
      this.orderform = data;
      this.db.list('trees').valueChanges().subscribe(data => {
        this.trees = data;
      });
    });
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
      this.orderform.forEach(orderforms => {
        if (orderforms.number == number) {
          check = 1;
        }
      });
      if (check == 0) {
        alert('Số điện thoại này chưa mua hàng lần nào.')
      }
      else {
        window.location.href = '/purchasehistory/' + number;
        this.user = null;
        this.number = null;
        this.phoneNumber.country = null;
        this.phoneNumber.number = null;
        this.verificationCode = null;
      }
    }).catch(error => {
      alert(error);
      this.verificationCode = null;
    });
  }

  open() {
    location.href = 'https://www.google.com/maps/dir//10.6924162,106.6212738/@10.6924428,106.6211336,19.79z';
  }

  onSearch(event) {
    this.showsearch = true;
    this.f_tree();
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        document.getElementById('reusult').style.display= 'inline';
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    }
  }

  f_tree() {
    this.items = this.trees;
  }

  nosearch() {
    this.showsearch = false;
  }

  search(id) {
    var type;
    this.trees.forEach(tree => {
      if(tree.id == id) {
        if (tree.type == 'Cây trồng trong nhà') {
          type = 'indoorplants';
        }
        else if (tree.type == 'Cây bụi') {
          type = 'shrubsbushes';
        }
        else if (tree.type == 'Cây mọng nước') {
          type = 'succulentscacti';
        }
        else if (tree.type == 'Cây ưa trồng trong vườn') {
          type = 'climbingspreadnegp';
        }
        else if(tree.type == 'Cây phong thuỷ') {
          type = 'fengshuitree';
        }
        else if (tree.type == 'Hoa chậu') {
          type = 'flowerpot';
        }
        const s = 'product/'+ type + '/' + id;
        window.location.href = s;
      }
    });
  }
}
