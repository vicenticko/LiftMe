import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministrarFirePageRoutingModule } from './administrar-fire-routing.module';

import { AdministrarFirePage } from './administrar-fire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministrarFirePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AdministrarFirePage]
})
export class AdministrarFirePageModule {}
