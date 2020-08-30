import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  trees;
  type;
  items;

  constructor(private db: AngularFireDatabase) {
    this.f_tree();
  }

  ngOnInit() {
    this.db.list('trees').valueChanges().subscribe(data => {
      this.trees = data;
      this.items = this.trees;
    });
  }

  filter() {
    this.f_tree();
    this.items = this.items.filter(item => item.type == this.type);
  }

  onSearch(event) {
    this.f_tree();
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    }
  }

  f_tree() {
    this.items = this.trees;
  }

  
}
