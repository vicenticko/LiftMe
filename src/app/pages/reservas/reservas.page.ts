import { Component, OnInit } from '@angular/core';


import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  latitud: number = 0;
  longitud: number = 0;
  direccion: string = "";
  distancia_metros: number = 0;
  tiempo_segundos: number = 0;

  //Simulación de una lista de viajes ya creados: eventualmente le cargan datos a la lista desde Storage:
  viajes: any[] = [{
    "id": 1,
    "conductor": "Lalo Cura",
    "asientos_disponibles": 4,
    "nombre_destino": "santa isabel sur, parque residendial monteandino, puente alto",
    "latitud": -33.59,
    "longitud": -70.53,
    "distancia_metros": 5000,
    "tiempo_segundos": 900,
    "estado_viaje": "pendiente",
    "pasajeros": []
  },{
    "id": 2,
    "conductor": "Elba Lazo",
    "asientos_disponibles": 1,
    "nombre_destino": "santa isabel sur, parque residendial monteandino, puente alto",
    "latitud": -33.59,
    "longitud": -70.53,
    "distancia_metros": 5000,
    "tiempo_segundos": 900,
    "estado_viaje": "en curso",
    "pasajeros": [17888444, 15999555]
  },{
    "id": 3,
    "conductor": "Elvis Teck",
    "asientos_disponibles": 0,
    "nombre_destino": "santa isabel sur, parque residendial monteandino, puente alto",
    "latitud": -33.59,
    "longitud": -70.53,
    "distancia_metros": 5000,
    "tiempo_segundos": 900,
    "estado_viaje": "terminado",
    "pasajeros": [14888555]
  },{
    "id": 4,
    "conductor": "Armando Casas",
    "asientos_disponibles": 0,
    "nombre_destino": "santa isabel sur, parque residendial monteandino, puente alto",
    "latitud": -33.59,
    "longitud": -70.53,
    "distancia_metros": 5000,
    "tiempo_segundos": 900,
    "estado_viaje": "pendiente",
    "pasajeros": [17888999,15444888,16555444,15888888]
  }
];

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  initMap(){
    //inicializa el mapa:
    this.map = L.map("map_html").locate({setView:true, maxZoom:16});
    //this.map = L.map("map_html").setView([-33.608552227594245, -70.58039819211703],16);
    
    //plantilla para que se vea el mapa:
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.map.on('locationfound', (e)=>{
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    });

    //buscador de direcciones:
    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);

    //accion para el buscador:
    this.geocoder.on('markgeocode', (e)=>{
      this.latitud = e.geocode.properties['lat'];
      this.longitud = e.geocode.properties['lon'];
      this.direccion = e.geocode.properties['display_name'];

      if(this.map){
        L.Routing.control({
          waypoints: [L.latLng(-33.608552227594245, -70.58039819211703),
                      L.latLng(this.latitud,this.longitud)],
          fitSelectedRoutes: true,
        }).on('routesfound', (e)=>{
          this.distancia_metros = e.routes[0].summary.totalDistance;
          this.tiempo_segundos = e.routes[0].summary.totalTime;
        }).addTo(this.map);
      }
    });

  }

}
