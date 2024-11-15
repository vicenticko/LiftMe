import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { PokeapiService } from 'src/app/services/pokeapi.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario: any;  

  constructor(private navController: NavController, private alertController: AlertController, private pokeAPI: PokeapiService) {}

  pokemon: any;

  ngOnInit(){
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.getPokemon();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
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
            // Elimina el usuario del almacenamiento local
            localStorage.removeItem('usuario');
            // Redirige a la página de login
            this.navController.navigateRoot('/login');
            console.log('Cerrando sesión...');
          }
        }
      ]
    });
    // Muestra la alerta
    await alert.present();
  }

  getPokemon(): void {
    this.pokeAPI.getRandomPokemon().subscribe((data) => {
        this.pokemon = data;
      },
      (error) => {
        console.error('Error fetching Pokémon:', error);
      }
    );
  }
  
}
