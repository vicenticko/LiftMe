import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrarFirePage } from './administrar-fire.page';

const routes: Routes = [
  {
    path: '',
    component: AdministrarFirePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrarFirePageRoutingModule {}
