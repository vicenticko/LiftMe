import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
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
  viaje: any;

  constructor(
    private activatedRoute: ActivatedRoute,  // Inyectado correctamente
    private router: Router, 
    private viajeService: ViajeService,
    private alertController: AlertController,
    private navController: NavController
  ) {}

  async ngOnInit() {
    this.initMap(); // Inicializa el mapa cuando se carga la página
    // Obtener el id del viaje desde la URL
    const idViaje = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (idViaje) {
      // Obtener el viaje usando el servicio
      this.viaje = await this.viajeService.getViaje(idViaje);
    }
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

  toViajes() {
    this.router.navigate(['/home/viajes']);
  }

  async eliminar(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            // Llamar al servicio de eliminación
            const result = await this.viajeService.deleteViaje(id);
            if (result) {
              // Si se eliminó correctamente, redirigir y actualizar la lista de viajes
              console.log('Viaje eliminado');
              // Redirigir a la página de reservas y actualizar la lista de viajes
              this.navController.navigateBack('/home/reservas');
            } else {
              console.error('No se pudo eliminar el viaje');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  
}
