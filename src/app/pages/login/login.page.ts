import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //NgModel:
  email: string = "";
  password: string = "";

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(){
    if(this.email=="asd@duocuc.cl" && this.password=="asd123456"){
      this.router.navigate(['/home']);
    }else{
      alert("Correo o Contraseña Incorrectos!");
    }
  }

}
