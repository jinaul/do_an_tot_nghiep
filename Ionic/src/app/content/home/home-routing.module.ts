import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'product',
        loadChildren: () => import('../product/product.module').then( m => m.ProductPageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../cart/cart.module').then( m => m.CartPageModule)
      },
      {
        path: 'purchase-history',
        loadChildren: () => import('../purchase-history/purchase-history.module').then( m => m.PurchaseHistoryPageModule)
      },
    ] 
  },
    {
      path: '',
      redirectTo: 'home/product',
      pathMatch: 'full'
    }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
