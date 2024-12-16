import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  pokemon: any;
  usuario: any;  
  usuarios: any[] = [];
  botonModificar: boolean = true;
  breeds: any[] = []; // Lista de razas
  randomImage: string = ''; // Imagen aleatoria
  profileImage: string = 'assets/images/pordefectoperfil.png';
  
  userDataQr: string = ''; // Para almacenar los datos que se mostrarán en el QR

  constructor(
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private router: Router,
    private pokeAPI: PokeapiService
  ) { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
    this.generateUserDataQr();  // Generar los datos para el QR al cargar la página
    this.getPokemon();
  }

  getPokemon(): void {
    this.pokeAPI.getRandomPokemon().subscribe((data) => {
        this.pokemon = data;
      },
      (error) => {
        console.error('Error fetching Pokémon:', error);
      }
    );
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

  generateUserDataQr() {
    // Crea una cadena con los datos del usuario
    const userData = {
      rut: this.usuario.rut,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      correo: this.usuario.correo_electronico,
      tiene_auto: this.usuario.tiene_auto,
      ...(this.usuario.tiene_auto === 'si' && {
        auto: {
          patente: this.usuario.patente,
          capacidad_asientos: this.usuario.capacidad_asientos,
          marca: this.usuario.marca_auto,
        },
      }),
    };

    // Convierte los datos a formato JSON para el QR
    this.userDataQr = JSON.stringify(userData, null, 2); // Indentación para mayor legibilidad en el QR
  }
}
