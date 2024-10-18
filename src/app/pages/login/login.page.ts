import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //NgModel:
  email: string = "";
  password: string = "";

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  login(){
    if(this.usuarioService.login(this.email,this.password)){
      this.router.navigate(['/home']);
    }else{
      alert("Correo o Contraseña Incorrectos!");
    }
  }

}
