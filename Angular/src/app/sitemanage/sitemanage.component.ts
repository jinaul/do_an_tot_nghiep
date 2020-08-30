import { Component, OnInit, ViewChild } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

import { Router } from '@angular/router'

@Component({
  selector: 'app-sitemanage',
  templateUrl: './sitemanage.component.html',
  styleUrls: ['./sitemanage.component.css']
})
export class SitemanageComponent implements OnInit {

  trees;
  tree = [{
    id: 0,
    name: "",
    number: 0,
    origin: "",
    price: 0,
    snapshot: "",
    type: "",
    imgs: [],
    characteristics: [],
    howtotakecareof: []
  }];

  content = "";
  location = "";
  extra = "";

  orderform;
  orderforms;

  id;

  @ViewChild('closes') closes;
  constructor(private storage: AngularFireStorage, private db: AngularFireDatabase, private route: Router) { }

  ngOnInit() {
    this.db.list('trees').valueChanges().subscribe(data => {
      this.trees = data;
      this.db.list('orderform').valueChanges().subscribe(data => {
        this.orderform = data;
      });
    });
  }

  fillter(id) {
    this.tree = this.trees.filter(tree => tree.id == id);
  }

  deleteimg(j) {
    this.tree[0].imgs.forEach((img, i) => {
      if (img == j) {
        this.tree[0].imgs.splice(i, 1);
      }
    });
    this.db.list('trees').update(this.tree[0].snapshot, { imgs: this.tree[0].imgs });
  }

  changeListener($event) {
    var check = 0;
    this.trees.forEach(tree => {
      if (tree.id == this.tree[0].id) {
        check = 1;
      }
    });
    var file = $event.target.files;
    var idimg = this.tree[0].imgs.length + 1;
    const filePath = `trees/${this.tree[0].id}/${idimg}-`;
    var storageRef = this.storage.ref(filePath + file[0].name);
    storageRef.put(file[0]).then(() => {
      storageRef.getDownloadURL().subscribe(url => {
        this.tree[0].imgs.push(url);
        if (check == 1) {
          this.db.list("trees").update(this.trees[0].snapshot, this.tree[0]);
        }
      })
    })
  }

  deletehowtotakecareof(n) {
    this.tree[0].howtotakecareof.forEach((item, i) => {
      if (i == n) {
        this.tree[0].howtotakecareof.splice(i, 1);
      }
    });
  }

  deletecharacteristics(l) {
    this.tree[0].characteristics.forEach((item, i) => {
      if (i == l) {
        this.tree[0].characteristics.splice(i, 1);
      }
    });
  }

  editextra(i, j, s) {
    this.content = i;
    this.location = j;
    this.extra = s;
  }
  
  saveeditextra() {
    if (this.location == "") {
      if (this.extra == 'characteristics') {
        this.tree[0].characteristics.push(this.content);
      }
      else {
        this.tree[0].howtotakecareof.push(this.content);
      }
    }
    else {
      if (this.extra == 'characteristics') {
        this.tree[0].characteristics[this.location] = this.content;
      }
      else {
        this.tree[0].howtotakecareof[this.location] = this.content;
      }
    }
    this.content = "";
    this.location = "";
    this.extra = "";
  }

  save() {
    var check = 0;
    this.trees.forEach(tree => {
      if (tree.id == this.tree[0].id) {
        check = 1;
      }
    });
    if (check == 1) {
      this.db.list('trees').update(this.tree[0].snapshot, this.tree[0]);
      this.tree[0] = {
        id: 0,
        name: "",
        number: 0,
        origin: "",
        price: 0,
        snapshot: "",
        type: "",
        imgs: [],
        characteristics: [],
        howtotakecareof: []
      };
    }
    else {
      var message = 0;
      if (this.tree[0].imgs.length > 0) {
        if (this.tree[0].name != "") {
          if (this.tree[0].number > 0) {
            if (this.tree[0].origin != "") {
              if (this.tree[0].price > 0) {
                if (this.tree[0].type != "") {
                  if (this.tree[0].characteristics.length > 0) {
                    if (this.tree[0].howtotakecareof.length > 0) {
                      message = 1;
                      this.db.list('trees').push(this.tree[0]).then((snapshot) => {
                        this.db.list('trees').update(snapshot.key, { snapshot: snapshot.key });
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (message == 0) {
        alert('Thêm sản phẩm mới không thành công!');
      }
      this.tree[0] = {
        id: 0,
        name: "",
        number: 0,
        origin: "",
        price: 0,
        snapshot: "",
        type: "",
        imgs: [],
        characteristics: [],
        howtotakecareof: []
      };
    }
  }

  new() {
    var a = [];
    this.trees.forEach(tree => {
      a.push(tree.id);
    });
    this.tree[0].id = Math.max.apply(Math, a) + 1;
  }

  huy() {
    this.tree[0] = {
      id: 0,
      name: "",
      number: 0,
      origin: "",
      price: 0,
      snapshot: "",
      type: "",
      imgs: [],
      characteristics: [],
      howtotakecareof: []
    };
    this.content = "";
    this.location = "";
    this.extra = "";

    this.orderforms == null;
  }

  checkorderform(id) {
    this.orderforms = this.orderform.filter(orderform => orderform.id == id);
  }

  numbertree(id) {
    var number = 0;
    this.trees.forEach(tree => {
      if (tree.id == id) {
        number = tree.number;
      }
    });
    return number;
  }

  confirm() {
    this.orderforms[0].status = 'Đã tiếp nhận';
    this.db.list('orderform').update(this.orderforms[0].snapshot, this.orderforms[0]);
    this.trees.forEach(tree => {
      this.orderforms[0].product.forEach(products => {
        if (tree.id == products.id) {
          tree.number -= products.number;
          this.db.list('trees').update(tree.snapshot, { number: tree.number });
        }
      });
    });
    this.closes.nativeElement.click();
  }

  delivery() {
    this.orderforms[0].status = 'Đang giao hàng';
    this.db.list('orderform').update(this.orderforms[0].snapshot, this.orderforms[0]);
    if(this.orderforms[0].status == 'Đã bị huỷ') {
      this.trees.forEach(tree => {
        this.orderforms[0].product.forEach(products => {
          if (tree.id == products.id) {
            tree.number -= products.number;
            this.db.list('trees').update(tree.snapshot, { number: tree.number });
          }
        });
      });
    }
    this.closes.nativeElement.click();
  }

  cancel() {
    this.orderforms[0].status = 'Đã bị huỷ';
    this.db.list('orderform').update(this.orderforms[0].snapshot, this.orderforms[0]);
    this.trees.forEach(tree => {
      this.orderforms[0].product.forEach(products => {
        if (tree.id == products.id) {
          tree.number += products.number;
          this.db.list('trees').update(tree.snapshot, { number: tree.number });
        }
      });
    });
    this.closes.nativeElement.click();
  }

  tn() {
    if (this.orderforms[0].status == 'Đã tiếp nhận' || this.orderforms[0].status == 'Đang giao hàng') {
      return false;
    }
    else {
      return true;
    }
  }

  gh() {
    if (this.orderforms[0].status == 'Đang giao hàng') {
      return false;
    }
    else {
      return true;
    }
  }

  f_delete() {
    this.trees.forEach(tree => {
      if(tree.id == this.id) {
        var s = 'trees/' + tree.snapshot;
        this.db.list(s).remove();
      }
    });
  }

  f_iddelete(id) {
    this.id = id;
  }

  h() {
    if (this.orderforms[0].status == 'Đã bị huỷ') {
      return false;
    }
    else {
      return true;
    }
  }

}
