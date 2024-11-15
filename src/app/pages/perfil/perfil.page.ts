import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: any;  
  usuarios: any[] = [];
  botonModificar: boolean = true;

  profileImage: string = 'assets/images/pordefectoperfil.png';

  constructor(private usuarioService: UsuarioService, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  navigateToModificarPerfil() {
    this.router.navigate(['/home/perfil/modificar-perfil']); // Navegar a la página editar-perfil
  }

}
