import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario: any;  

  constructor(private navController: NavController, private alertController: AlertController) {}

  

  ngOnInit(){
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  }

  async logout() {
    const alert = await this.alertController.create({
      //header: 'Confirmar Logout',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Logout cancelado');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            localStorage.removeItem('usuario');
            this.navController.navigateRoot('/login');
            console.log('Cerrando sesión...');
          }
        }
      ]
    });

    await alert.present();
  }

}
