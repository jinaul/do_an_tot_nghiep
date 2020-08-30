import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseHistoryPage } from './purchase-history.page';

const routes: Routes = [
  {
    path: '',
    component: PurchaseHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseHistoryPageRoutingModule {}
