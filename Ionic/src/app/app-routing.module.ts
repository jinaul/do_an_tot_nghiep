import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'content/:number',
    loadChildren: () => import('./content/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('./content/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./content/order/order.module').then( m => m.OrderPageModule)
  },
  {
    path: 'detail-order/:number',
    loadChildren: () => import('./content/detail-order/detail-order.module').then( m => m.DetailOrderPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
