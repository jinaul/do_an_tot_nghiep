import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { AngularFireDatabase } from '@angular/fire/database';

import { CartService } from '../../cart.service';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  id_tree;
  trees;
  tree;

  number;
  items;
  item = {
    id: Number,
    img: "",
    name: "",
    type: "",
    price: "",
    number: 0,
    intomoney: 0
  };

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute, private cart: CartService, private alertController: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(para => {
      this.id_tree = para.get('id');
      this.id_tree = Number(this.id_tree);
    });
    this.db.list('trees').valueChanges().subscribe(data => {
      this.trees = data;
      this.tree = this.trees.filter(trees => trees.id == this.id_tree);
    });
  }

  addtocart() {
    if (this.number > 0) {
      if (this.number <= this.tree[0].number) {
        if (this.checkcart(this.tree[0].id)) {
          this.item.id = this.tree[0].id;
          this.item.img = this.tree[0].imgs[0];
          this.item.name = this.tree[0].name;
          this.item.type = this.tree[0].type;
          this.item.price = this.tree[0].price;
          this.item.number = this.number;
          this.item.intomoney = this.intomoney(this.number, this.tree[0].price);
          this.cart.addtoCart(this.item);
          this.presentAlert('Đã bỏ vào giỏ hàng!');
        }
        else {
          this.items = this.cart.getItems();
          this.items.forEach(item => {
            if (item.id == this.tree[0].id) {
              if(item.number + this.number > this.tree[0].number) {
                this.presentAlert('Số lượng đã không còn đủ để cung cấp cho quí khách!');
              }
              else {
                item.number += this.number;
                item.intomoney = this.intomoney(item.number, item.price);
              }
            }
          });
          this.cart.clearCart();
          this.items.forEach(item => {
            this.cart.addtoCart(item);
          });
        }
      }
      else {
        this.presentAlert('Xin lỗi quí khách vì sản phẩm quí khách chọn mua không còn đủ số lượng quí khách yêu cầu.')
      }
    }
    else {
    this.presentAlert('Bạn vui lòng chọn số lượng!');
    }
  }
  checkcart(id) {
    var check = 0;
    var items = this.cart.getItems();
    items.forEach(item => {
      if (item.id == id) {
        check = 1;
      }
    });
    if (check == 0) {
      return true;
    }
    else {
      return false;
    }
  }
  
  intomoney(number, price) {
    return number * price;
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
