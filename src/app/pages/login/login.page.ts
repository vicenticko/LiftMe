import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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

  constructor(private router: Router, private usuarioService: UsuarioService, private alertController: AlertController) { }

  ngOnInit() {
  }

  async login() {
  if (await this.usuarioService.login(this.email, this.password)) {
    this.email = '';
    this.password = '';
    this.router.navigate(['/home']);
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
