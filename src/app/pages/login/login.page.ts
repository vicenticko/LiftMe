import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
//import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  titulo: string = "Página de Login";
  email: string = "";
  password: string = "";
  usuarios: any[] = [];

  constructor(
    private router: Router, 
    private alertController: AlertController
    //private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    // Cargar usuarios al inicializar la página
    //this.usuarios = this.usuarioService.obtenerUsuarios();
  }

  async login() {
    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      await this.showAlert("Por favor, ingresa ambos campos: correo y contraseña.");
      return;
    }

    // Buscar el usuario con las credenciales ingresadas
    const user = this.usuarios.find((u: { correo_electronico: string; contraseña: string; }) => 
      u.correo_electronico === trimmedEmail && u.contraseña === trimmedPassword
    );

    if (user) {
      this.email = '';
      this.password = '';
      this.router.navigate(['/home']);
    } else {
      await this.showAlert("Correo o contraseña inválidos.");
    }
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
