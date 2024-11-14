import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { ViajeService } from 'src/app/services/viaje.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {
  
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  private routingControl: any; // Control de rutas
  usuario: any;

  // Definir tarifa por kilómetro
  private tarifaPorKilometro = 800; // Tarifa a 800 unidades monetarias por kilómetro
  
  viaje = new FormGroup({
    id: new FormControl('', [Validators.required]),
    conductor: new FormControl('', [Validators.required]),
    asientos_disp: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required]),
    nombre_destino: new FormControl('', [Validators.required]),
    latitud: new FormControl('', [Validators.required]),
    longitud: new FormControl('', [Validators.required]),
    distancia_metros: new FormControl('', [Validators.required]),
    tiempo_minutos: new FormControl(0, [Validators.required]),
    estado_viaje: new FormControl('pendiente'),
    pasajeros: new FormControl([])
  });

  viajes: any[] = [];

  constructor(
    private viajeService: ViajeService, 
    private navController: NavController,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.viaje.controls.conductor.setValue(this.usuario.nombre);
    this.viaje.controls.asientos_disp.setValue(this.usuario.capacidad_asientos);
    await this.rescatarViajes();
  }

  initMap() {
    try {
      this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });
      
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
  
      this.map.on('locationfound', (e) => {
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
      });
  
      this.geocoder = G.geocoder({
        placeholder: "Ingrese dirección a buscar",
        errorMessage: "Dirección no encontrada"
      }).addTo(this.map);
  
      this.geocoder.on('markgeocode', (e) => {
        let lat = e.geocode.properties['lat'];
        let lon = e.geocode.properties['lon'];
        this.viaje.controls.nombre_destino.setValue(e.geocode.properties['display_name']);
        
        this.viaje.controls.id.setValue(uuidv4());
        this.viaje.controls.latitud.setValue(lat);
        this.viaje.controls.longitud.setValue(lon);
        
        if (this.map) {
          // Limpiar el control de rutas anterior si existe
          if (this.routingControl) {
            this.map.removeControl(this.routingControl);
          }

          this.routingControl = L.Routing.control({
            waypoints: [
              L.latLng(-33.598465138173324, -70.57868924535276),
              L.latLng(lat, lon)
            ],
            fitSelectedRoutes: true,
          }).on('routesfound', (e) => {
            const distanciaMetros = e.routes[0].summary.totalDistance;
            this.viaje.controls.distancia_metros.setValue(distanciaMetros);
            this.viaje.controls.tiempo_minutos.setValue(Math.round(e.routes[0].summary.totalTime / 60));

            // Calcular el valor basado en la distancia y redondear a un entero
            const valorViaje = Math.floor((distanciaMetros / 1000) * this.tarifaPorKilometro); // Convertir metros a kilómetros y eliminar decimales
            this.viaje.controls.valor.setValue(valorViaje.toString());
          }).addTo(this.map);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Método para mostrar la alerta de confirmación
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¡Viaje creado exitosamente!',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método para crear el viaje y mostrar la alerta
  async crearViaje() {
    if (await this.viajeService.createViaje(this.viaje.value)) {
      this.presentAlert(); // Mostrar alerta de confirmación
      
      // Restablecer el formulario, excluyendo el campo de asientos disponibles
      const asientosDisp = this.viaje.controls.asientos_disp.value; // Guardar el valor actual de asientos disponibles
      this.viaje.reset(); // Restablecer el formulario
      this.viaje.controls.asientos_disp.setValue(asientosDisp); // Reestablecer solo el campo de asientos disponibles
  
      await this.rescatarViajes(); // Actualizar la lista de viajes
    }
  }
  
  async rescatarViajes() {
    this.viajes = await this.viajeService.getViajes();
  }

  goToDetalleReserva(id: string) {
    this.navController.navigateForward(`/home/reservas/detalle-reserva/${id}`);
  }
}
