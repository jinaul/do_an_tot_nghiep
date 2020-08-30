import { Component, OnInit } from '@angular/core';

import { CartService } from '../../cart.service';

import { AngularFireDatabase } from '@angular/fire/database';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  items = [];

  totalmoney;

  provinceandcitys;
  district;
  districts;
  ward;
  wards;
  local;
  specificaddress;

  orderforms = [];
  orderform = {
    id: 0,
    product: [],
    status: "Đang xử lí",
    gender: "",
    name: "",
    number: "",
    deliveryaddress: "",
    datetime: "",
    totalmoney: 0,
    deliverydate: new Date()
  }
  datetime;

  trees;

  constructor(private db: AngularFireDatabase, private cart: CartService, private alertController: AlertController) { }

  ngOnInit() {
    this.totalmoney = 0;
    this.items = this.cart.getItems();
    this.items.forEach(item => {
      this.totalmoney += item.intomoney;
    });
    this.db.list('local').valueChanges().subscribe(data => {
      this.local = data[0];
      this.db.list('orderform').valueChanges().subscribe(data => {
        this.orderforms = data;
        this.db.list('trees').valueChanges().subscribe(data => {
          this.trees = data;
        });
      });
    });
  }

  changeprovinceandcity() {
    this.district = this.local.filter(locals => locals.name == this.provinceandcitys)
    this.district = this.district[0].huyen;
  }
  changedistrict() {
    this.ward = this.district.filter(districts => districts.name == this.districts)
    this.ward = this.ward[0].xa;
  }

  order() {
    var today = new Date();
    var i;
    if (today.getMonth() < 8) {
      i = '-0';
    }
    else {
      i = '-';
    }
    var date = today.getFullYear() + i + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (this.orderform.gender != '') {
      if (this.orderform.name.length > 1) {
        if (this.orderform.number.length == 10 && this.checknumber(this.orderform.number)) {
          if (this.provinceandcitys != null && this.districts != null && this.wards != null && this.specificaddress != null) {
            if (new Date(date).getTime() < new Date(this.orderform.deliverydate).getTime()) {
              var id = 0;
              id += this.orderforms.length;
              this.orderform.id = id;
              this.orderform.product = this.items;
              this.orderform.totalmoney = this.totalmoney;
              var s = this.specificaddress + ', ' + this.wards + ', ' + this.districts + ', ' + this.provinceandcitys;
              this.orderform.deliveryaddress = s;
              this.orderform.datetime = today.getDate() + i + (today.getMonth() + 1) + '-' + today.getFullYear() + ' ' + time;
              this.db.list('orderform').push(this.orderform).then((snapshot) => {
                this.db.list('orderform').update(snapshot.key, { snapshot: snapshot.key });
              }); 
              this.trees.forEach(tree => {
                this.items.forEach(item => {
                  if(item.id == tree.id) {
                    tree.number -= item.number;
                    this.db.list('trees').update(tree.snapshot, tree);
                  }
                });
              });
              this.cart.clearCart();
              this.presentAlert('Đặt hàng thành công.');
              this.orderform.name = '';
              this.orderform.number = ''
              this.orderform.deliverydate = new Date();
              this.items = null;
              this.provinceandcitys = null;
              this.totalmoney = 0;
              this.districts = null;
              this.wards = null;
              this.specificaddress = null;
              this.cart.clearCart();
            } else {
              this.presentAlert('Ngày giao hàng không phù hợp!')
            }
          } else {
            this.presentAlert('Quí khách vui lòng nhập đầy đủ thông tin giao hàng!');
          }
        } else {
          this.presentAlert('Số điện thoại bạn nhập không đúng!')
        }
      } else {
        this.presentAlert('Quí khách vui lòng nhập tên chính xác.')
      }
    } else {
      this.presentAlert('Vui lòng chọn giới tính của quí khách.')
    }
  }

  checknumber(number) {
    if (Number(number) < 860000000 && Number(number) > 319999999) {
      return true;
    }
    else {
      return false
    }
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
