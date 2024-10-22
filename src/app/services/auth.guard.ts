import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';

export const authGuard: CanActivateFn = (route, state) => {
  const navController = inject(NavController);
  const isAuthenticated = localStorage.getItem("usuario") ? true : false;

  //validacion del usuario si esta log para acceder a home y children:
  if(!isAuthenticated && state.url !== '/login'){
    navController.navigateRoot('/login');
    return false;
  }
  
  return true;
};
