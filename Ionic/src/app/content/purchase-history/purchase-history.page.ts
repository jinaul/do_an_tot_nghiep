import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.page.html',
  styleUrls: ['./purchase-history.page.scss'],
})
export class PurchaseHistoryPage implements OnInit {

  orderform;
  number;
  orderforms;

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.number = window.location.href.slice(window.location.href.indexOf('content') + 8, window.location.href.indexOf('content') + 18);
    this.db.list('orderform').valueChanges().subscribe((data) => {
      this.orderform = data;
      this.orderforms = this.orderform.reverse().filter((orderform) => orderform.number == this.number);
    });
  }
}
