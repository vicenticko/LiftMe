import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {
  private map: L.Map | undefined;
  // Define cualquier otra propiedad necesaria aquí, como geocoder o routingControl.

  constructor(private router: Router, private viajeService: ViajeService ) {}

  ngOnInit() {
    this.initMap(); // Inicializa el mapa cuando se carga la página
  }

  initMap() {
    try {
      this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      // Puedes añadir el resto de la configuración del mapa aquí.
    } catch (error) {
      console.error(error);
    }
  }

  toViajes() {
    this.router.navigate(['/home/viajes']);
  }

  async eliminar(id_eliminar:string){
    this.viajeService.deleteViaje(id_eliminar);
  }

}
