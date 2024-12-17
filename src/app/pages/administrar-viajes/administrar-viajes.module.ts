import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministrarViajesPageRoutingModule } from './administrar-viajes-routing.module';

import { AdministrarViajesPage } from './administrar-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministrarViajesPageRoutingModule
  ],
  declarations: [AdministrarViajesPage]
})
export class AdministrarViajesPageModule {}
