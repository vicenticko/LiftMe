import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  async login(){
    if(await this.usuarioService.login(this.email,this.password)){
      this.router.navigate(['/home']);
    }else{
      alert("Correo o Contraseña Incorrectos!");
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
}
