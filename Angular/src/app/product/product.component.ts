import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router'

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  type;
  filter;
  trees;

  pagesize = 8;
  pagecurrent = 1;
  totlepage;

  constructor(private storage: AngularFireStorage, private db: AngularFireDatabase, private route: Router, private router: ActivatedRoute) { }

  ngOnInit() {
    this.type = window.location.href.slice(window.location.href.lastIndexOf('/') + 1);;
    if (this.type == 'indoorplants') {
      this.filter = 'Cây trồng trong nhà';
    }
    else if (this.type == 'shrubsbushes') {
      this.filter = 'Cây bụi';
    }
    else if (this.type == 'succulentscacti') {
      this.filter = 'Cây mọng nước';
    }
    else if (this.type == 'climbingspreadnegp') {
      this.filter = 'Cây ưa trồng trong vườn'
    }
    else if (this.type == 'fengshuitree') {
      this.filter = 'Cây phong thuỷ'
    }
    else if (this.type == 'flowerpot') {
      this.filter = 'Hoa chậu'
    }
    this.db.list('trees').valueChanges().subscribe(data => {
      this.trees = data;
      this.trees = this.trees.filter(tree => tree.type == this.filter);
      this.totlepage = Math.ceil(this.trees.length / this.pagesize);
    });
  }

  status(x) {
    if (x > 0) {
      return "Còn hàng";
    }
    else {
      return "Hết hàng"
    }
  }

  detail(x) {
    var link = '' + 'product/' + this.type;
    this.route.navigate([link, x])
  }

  next() {
    if (this.pagecurrent < this.totlepage) {
      this.pagecurrent += 1;
    }
  }

  previrous() {
    if (this.pagecurrent > 0) {
      this.pagecurrent -= 1;
    }
  }

  currentpage(x) {
    this.pagecurrent = x + 1;
  }

  pages() {
    var a = []
    for (var i = 0; i < this.totlepage; i++) {
      a.push(i);
    }
    return a;
  }
}