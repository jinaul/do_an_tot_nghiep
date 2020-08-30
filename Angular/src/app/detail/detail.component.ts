import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

import { CartService } from '../cart.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  id;
  trees;
  tree;

  number: 0;
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

  @ViewChild('close') close;
  @ViewChild('open') open;

  constructor(private storage: AngularFireStorage, private db: AngularFireDatabase, private cart: CartService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(para => {
      this.id = para.get('id');
      this.id = Number(this.id);
    });
    this.db.list('trees').valueChanges().subscribe(data => {
      this.trees = data;
      this.tree = this.trees.filter(trees => trees.id == this.id);
      this.db.list('local').valueChanges().subscribe(data => {
        this.local = data[0];
        this.db.list('orderform').valueChanges().subscribe(data => {
          this.orderforms = data;
        });
      });
    });
  }

  addtocart() {
    var check = 0;
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
          check = 1;
        }
        else {
          this.items = this.cart.getItems();
          this.items.forEach(item => {
            if (item.id == this.tree[0].id) {
              if(item.number + this. number > this.tree[0].number) {
                alert('Số lượng đã không còn đủ để cung cấp cho quí khách!');
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
        alert("Xin lỗi quí khách vì sản phẩm quí khách chọn mua không còn đủ số lượng quí khách yêu cầu")
      }
    }
    else {
      alert("Bạn vui lòng chọn số lượng!");
    }
    if(check == 1) {
      alert('Đã bỏ vào giỏ hàng!');
      check = 0;
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

  buynow() {
    if (this.number > 0) {
      if (this.number <= this.tree[0].number) {
          this.item.id = this.tree[0].id;
          this.item.img = this.tree[0].imgs[0];
          this.item.name = this.tree[0].name;
          this.item.type = this.tree[0].type;
          this.item.price = this.tree[0].price;
          this.item.number = this.number;
          this.item.intomoney = this.intomoney(this.number, this.tree[0].price);
          this.cart.addtoCart(this.item);
          this.open.nativeElement.click();
      }
      else {
        alert("Xin lỗi quí khách vì sản phẩm quí khách chọn mua không còn đủ số lượng quí khách yêu cầu")
      }
    }
    else {
      alert("Bạn vui lòng chọn số lượng!");
    }
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
              this.orderform.product.push(this.item);
              this.orderform.totalmoney = this.item.intomoney;
              var s = this.specificaddress + ', ' + this.wards + ', ' + this.districts + ', ' + this.provinceandcitys;
              this.orderform.deliveryaddress = s;
              this.orderform.datetime = today.getDate() + i + (today.getMonth() + 1) + '-' + today.getFullYear() + ' ' + time;
              this.db.list('orderform').push(this.orderform).then((snapshot) => {
                this.db.list('orderform').update(snapshot.key, { snapshot: snapshot.key });
              });
              this.trees.forEach(tree => {
                if(tree.id == this.item.id) {
                  tree.number -= this.item.number;
                  this.db.list('trees').update(tree.snapshot, tree);
                }
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
              this.item.intomoney = 0;
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

  changeprovinceandcity() {
    this.district = this.local.filter(locals => locals.name == this.provinceandcitys)
    this.district = this.district[0].huyen;
  }

  changedistrict() {
    this.ward = this.district.filter(districts => districts.name == this.districts)
    this.ward = this.ward[0].xa;
  }

}

