import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router'

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  accounts;
  accountname;
  password;
  
  constructor(private storage: AngularFireStorage, private db: AngularFireDatabase, private route: Router) { }

  ngOnInit() {
    this.db.list('accounts').valueChanges().subscribe(data => {
      this.accounts = data;
    })
  }

  signin() {
    this.accounts.forEach(account => {
      if (account.name == this.accountname && account.password == this.password) {
        this.route.navigate(['admin/sitemanage']);
      }
      else {
        alert('Sai tên tài khoản hoặc mật khẩu.')
      }
    });
  }
}
