import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.page.html',
  styleUrls: ['./detail-order.page.scss'],
})
export class DetailOrderPage implements OnInit {

  orderform;
  number;
  orderforms;

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(para => {
      this.number = para.get('number');
    });
    this.db.list('orderform').valueChanges().subscribe((data) => {
      this.orderform = data;
      this.orderforms = this.orderform.reverse().filter((orderform) => orderform.id == this.number);
    });
  }
}
