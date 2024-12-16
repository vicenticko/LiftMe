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
  usuario: any;
  viaje: any;
  viajes: any[] = [];
  tieneViajeActivo: boolean = false;

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
    const mapContainerId = 'map_html'; // ID del contenedor en el HTML
  
    // Verifica si el mapa ya está inicializado y destrúyelo
    if (this.map) {
      this.map.remove(); // Elimina el mapa existente
      this.map = undefined;
    }
  
    try {
      // Inicializa el mapa en el contenedor
      this.map = L.map(mapContainerId).locate({ setView: true, maxZoom: 16 });
  
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
  
      // Configuración adicional del mapa (si aplica)
      console.log('Mapa inicializado correctamente.');
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  toViajes() {
    this.fireViajeService.getViajes().then(viajes => {
      // Guardar los viajes en localStorage
      localStorage.setItem('viajes', JSON.stringify(viajes));
  
      // Navegar a la página de viajes
      this.router.navigate(['/home/viajes']);
    }).catch(error => {
      console.error('Error al obtener los viajes', error);
    });
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
              
              // Eliminar el viaje del localStorage
              localStorage.removeItem('viaje'); // Elimina el viaje almacenado en localStorage
              
              // Redirigir a la página de reservas después de eliminar el viaje
              this.navController.navigateBack('/home/reservas');
              await this.rescatarViajes();
              
            } else {
              console.error('No se pudo eliminar el viaje');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
 
  async rescatarViajes() {
    this.viajes = await this.fireViajeService.getViajes();
    this.tieneViajeActivo = this.viajes.some(v => v.uid_conductor === this.usuario.uid);
  }

  ionViewWillLeave() {
    // Destruye el mapa al salir de la página
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      console.log('Mapa eliminado correctamente.');
    }
  }

}
