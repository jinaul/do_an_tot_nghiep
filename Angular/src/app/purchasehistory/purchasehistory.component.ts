import { Component, OnInit } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchasehistory',
  templateUrl: './purchasehistory.component.html',
  styleUrls: ['./purchasehistory.component.css'],
})
export class PurchasehistoryComponent implements OnInit {

  orderform;
  number;
  orderforms;

  constructor(private storage: AngularFireStorage, private db: AngularFireDatabase, private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((para) => {
      this.number = para.get('number');
    });
    this.db.list('orderform').valueChanges().subscribe((data) => {
      this.orderform = data;
      this.orderforms = this.orderform.reverse().filter((orderform) => orderform.number == this.number);
    });
  }
}
