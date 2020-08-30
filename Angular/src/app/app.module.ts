import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


// Thư viện Firebasse
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import * as firebase from 'firebase';

import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { SitemanageComponent } from './sitemanage/sitemanage.component';
import { ProductComponent } from './product/product.component';
import { PurchasehistoryComponent } from './purchasehistory/purchasehistory.component';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    HomeComponent,
    DetailComponent,
    AdminComponent,
    UserComponent,
    SitemanageComponent,
    ProductComponent,
    PurchasehistoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    //Firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    NgxPaginationModule,
    RouterModule.forRoot([
      {
        path: '', component: UserComponent, children: [
          { path: '', component: HomeComponent },
          { path: 'cart', component: CartComponent },
          { path: 'product/indoorplants', component: ProductComponent },
          { path: 'product/shrubsbushes', component: ProductComponent },
          { path: 'product/succulentscacti', component: ProductComponent },
          { path: 'product/climbingspreadnegp', component: ProductComponent },
          { path: 'product/fengshuitree', component: ProductComponent },
          { path: 'product/flowerpot', component: ProductComponent },
          { path: 'product/indoorplants/:id', component: DetailComponent },
          { path: 'product/shrubsbushes/:id', component: DetailComponent },
          { path: 'product/succulentscacti/:id', component: DetailComponent },
          { path: 'product/climbingspreadnegp/:id', component: DetailComponent },
          { path: 'product/fengshuitree/:id', component: DetailComponent },
          { path: 'product/flowerpot/:id', component: DetailComponent },
          { path: 'purchasehistory/:number', component: PurchasehistoryComponent },
        ]
      },
      { path: 'admin', component: AdminComponent },
      { path: 'admin/sitemanage', component: SitemanageComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
