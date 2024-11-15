import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'home/reservas/detalle-reserva/:id',
    loadChildren: () => import('./pages/detalle-reserva/detalle-reserva.module').then( m => m.DetalleReservaPageModule)
  },
  {
    path: 'home/perfil/modificar-perfil',
    loadChildren: () => import('./pages/modificar-perfil/modificar-perfil.module').then( m => m.ModificarPerfilPageModule)
  },
  {
    path: '**', //<----Siempre al final
    loadChildren: () => import('./pages/error404/error404.module').then( m => m.Error404PageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
