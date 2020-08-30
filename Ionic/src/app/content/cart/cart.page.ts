import { Component, OnInit } from '@angular/core';

import { CartService } from '../../cart.service';

import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  items;
  constructor(private db: AngularFireDatabase, private cart: CartService,) { }

  ngOnInit() {
    this.items = this.cart.getItems();
  }

  f_totalmoney() {
    var totalmoney = 0;
    this.items.forEach(item => {
      totalmoney += item.intomoney;
    });
    return totalmoney;
  }

}
