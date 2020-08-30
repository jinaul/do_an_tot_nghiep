import { Component, OnInit, ViewChild } from '@angular/core';

import { CartService } from '../cart.service';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items;
  show = true;
  intomoney = 0;

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

  @ViewChild('close') close;

  constructor(private storage: AngularFireStorage, private db: AngularFireDatabase, private cart: CartService) { }

  ngOnInit() {
    this.show = true;
    this.intomoney = 0;
    this.items = this.cart.getItems();
    if (this.items.length > 0) {
      this.show = false;
    }
    this.items.forEach(item => {
      this.intomoney += item.intomoney;
      item.intomoney = item.number * item.price;
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

  removeitem(id) {
    this.items.forEach((item, i) => {
      if (item.id == id) {
        this.items.splice(i, 1);
        this.cart.clearCart();
        this.items.forEach(item => {
          this.cart.addtoCart(item);
        });
      }
    });
    this.intomoney = 0;
    this.items.forEach(item => {
      this.intomoney += item.intomoney;
    });
    if (this.items.length > 0) {
      this.show = false;
    }
    else {
      this.show = true;
    }
  }

  changeintomoney(j) {
    this.items[j].intomoney = this.items[j].number * this.items[j].price;
    this.intomoney = 0;
    this.items.forEach(item => {
      this.intomoney += item.intomoney;
    });
  }

  fail() {
    alert('Thanh toán không thành công vì giỏ hàng của bạn chưa có sản phẩm nào!');
  }

  back() {
    window.history.back();
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
    var i, j, k, l, m, n;
    if (today.getMonth() < 9) {
      i = '-0';
    }
    else {
      i = '-';
    }
    if (today.getDate() < 10) {
      j = '-0';
    }
    else {
      j = '-';
    }
    var date = today.getFullYear() + i + (today.getMonth() + 1) + j + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var todayx = new Date(date);
    todayx.setDate(todayx.getDate() + 14);
    var todayx = new Date(todayx);
    if (todayx.getMonth() < 9) {
      k = '-0';
    }
    else {
      k = '-';
    }
    if (todayx.getDate() < 10) {
      l = '-0'
    }
    else {
      l = '-';
    }
    var datex = todayx.getFullYear() + k + (todayx.getMonth() + 1) + l + todayx.getDate();
    var todayy = new Date(date);
    todayy.setDate(todayy.getDate() + 3);
    var todayy = new Date(todayy);
    if (todayy.getMonth() < 9) {
      m = '-0';
    }
    else {
      m = '-';
    }
    if (todayy.getDate() < 10) {
      n = '-0'
    }
    else {
      n = '-';
    }
    var datey = todayy.getFullYear() + m + (todayy.getMonth() + 1) + n + todayy.getDate();
    if (this.orderform.gender != '') {
      if (this.orderform.name.length > 1) {
        if (this.orderform.number.length == 10 && this.checknumber(this.orderform.number)) {
          if (this.provinceandcitys != null && this.districts != null && this.wards != null && this.specificaddress != null) {
            if (new Date(datey).getTime() <= new Date(this.orderform.deliverydate).getTime() && new Date(datex).getTime() > new Date(this.orderform.deliverydate).getTime()) {
              var id = 0;
              id += this.orderforms.length;
              this.orderform.id = id;
              this.orderform.product = this.items;
              this.orderform.totalmoney = this.intomoney;
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
              this.close.nativeElement.click();
              alert('Đặt hàng thành công.');
              this.orderform.name = '';
              this.orderform.number = ''
              this.orderform.deliverydate = new Date();
              this.items = null;
              this.provinceandcitys = null;
              this.districts = null;
              this.wards = null;
              this.specificaddress = null;
              this.intomoney = 0;
              this.cart.clearCart();
            } else {
              alert('Ngày giao hàng không phù hơp!');
            }
          } else {
            alert('Quí khách vui lòng nhập đầy đủ thông tin giao hàng!');
          }
        } else {
          alert('Số điện thoại bạn nhập không đúng!')
        }
      } else {
        alert('Quí khách vui lòng nhập tên chính xác.');
      }
    } else {
      alert('Vui lòng chọn giới tính của quí khách.')
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
}

