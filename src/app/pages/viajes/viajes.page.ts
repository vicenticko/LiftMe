import { Component, OnInit } from '@angular/core';
import { FireViajeService } from 'src/app/services/fire-viaje.service';


@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  tieneViajeActivo: boolean = false;
  usuario: any;

  viajes: any[] = [];
  
  constructor(private fireViajeService: FireViajeService) { }

  async ngOnInit() {
    await this.rescatarViajes();
  }
  
  async rescatarViajes() {
    const viajesStorage = localStorage.getItem('viajes');
    
    if (viajesStorage) {
      // Si existen viajes en el localStorage, los parseamos y los asignamos a this.viajes
      this.viajes = JSON.parse(viajesStorage);
      this.tieneViajeActivo = this.viajes.some(v => v.uid_conductor === this.usuario.uid);
    } else {
      
      // Guardamos los viajes en localStorage para futuras consultas
      localStorage.setItem('viajes', JSON.stringify(this.viajes));
    }
  }

}
