import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario: any;  

  constructor(private navController: NavController) {}

  ngOnInit(){
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  }

  logout(){
    localStorage.removeItem('usuario');
    this.navController.navigateRoot('/login');
  }

}
