import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {

  private map: L.Map | undefined;
  usuario: any;

  constructor() { }

  ngOnInit() {
  }

  initMap() {
      try {
        this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });
  
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
  
        // Aquí podrías añadir el marcador o configuración de mapa adicional.
      } catch (error) {
        console.error(error);
      }
    }

}
