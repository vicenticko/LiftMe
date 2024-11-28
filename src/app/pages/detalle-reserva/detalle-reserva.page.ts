import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import * as L from 'leaflet';
import { FireViajeService } from 'src/app/services/fire-viaje.service'; // Importamos el nuevo servicio

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {
  private map: L.Map | undefined;
  viaje: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private alertController: AlertController,
    private navController: NavController,
    private fireViajeService: FireViajeService // Usamos FireViajeService en lugar de ViajeService
  ) {}

  async ngOnInit() {
    this.initMap(); // Inicializa el mapa cuando se carga la página
    const idViaje = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (idViaje) {
      // Obtener el viaje desde Firestore utilizando fireViajeService
      this.viaje = await this.fireViajeService.getViaje(idViaje);
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
            // Llamar al servicio de eliminación usando FireViajeService
            const result = await this.fireViajeService.deleteViaje(id);
            if (result) {
              console.log('Viaje eliminado');
              // Redirigir a la página de reservas después de eliminar el viaje
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
