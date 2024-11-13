import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  email: string = "";

  constructor(private router: Router, private alertController: AlertController, private fireAuth: AngularFireAuth, private fireService: FireService ) { }

  ngOnInit() {
  }

  async recuperar() {
    if (await this.fireService.recuperarUsuario(this.email)) {
      await this.mostrarAlerta("Éxito", "Revisa tu correo para encontrar la nueva contraseña!");
      this.router.navigate(['/login']);
      this.email = "";
    } else {
      await this.mostrarAlerta("Error", "El usuario no existe!");
    }
  }

  // Método para mostrar alertas usando AlertController
  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
