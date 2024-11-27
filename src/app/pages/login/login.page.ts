import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";

  showPassword = false;

  constructor(private router: Router, private usuarioService: UsuarioService, private alertController: AlertController, private fireService: FireService) { }

  ngOnInit() {
  }

  async login() {
    if (await this.fireService.login(this.email, this.password)) {
      // Si el login es exitoso, obtenemos los datos del usuario desde Firebase
      const usuario = await this.fireService.getUsuarioPorCorreo(this.email);
      
      // Guardar los datos del usuario en localStorage
      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
      }

      this.email = '';
      this.password = '';
      this.router.navigate(['/home']);
      console.log('Login exitoso');
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo o Contraseña Incorrectos!',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
