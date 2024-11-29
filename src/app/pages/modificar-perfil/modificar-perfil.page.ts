import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.page.html',
  styleUrls: ['./modificar-perfil.page.scss'],
})
export class ModificarPerfilPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: any;

  usuario: any = {
    rut: '',
    nombre: '',
    apellido: '',
    correo_electronico: '',
    tiene_auto: '',
    marca_auto: '',
    patente: '',
    capacidad_asientos: '',
  };
  profileImage: string = 'assets/images/pordefectoperfil.png';

  constructor(private usuarioService: UsuarioService, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
    // Cargar datos del usuario desde localStorage al inicializar la página
    const datosUsuario = localStorage.getItem('usuario');
    if (datosUsuario) {
      this.usuario = JSON.parse(datosUsuario); // Convertir el JSON en un objeto
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result; // Asignar la imagen seleccionada
      };
      reader.readAsDataURL(file);
    }
  }

  navigateToModificarPerfil() {
    this.router.navigate(['/home/perfil/modificar-perfil']); // Navegar a la página editar-perfil
  }
  
  guardarPerfil() {
    console.log('Datos del usuario antes de guardar:', this.usuario);
    try {
      if (this.validarCampos()) {
        // Guardar los datos en localStorage
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        console.log('Datos guardados en localStorage:', localStorage.getItem('usuario'));
        alert('Información guardada con éxito.');
  
        // Redirigir a la página de perfil
        this.router.navigate(['/home/perfil']); // Cambia '/home/perfil' según tu configuración de rutas
      } else {
        alert('Por favor, completa todos los campos obligatorios.');
      }
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      alert('Ocurrió un error al guardar la información.');
    }
  }
  
   

  validarCampos(): boolean {
    if (!this.usuario.rut || !this.usuario.nombre || !this.usuario.apellido || !this.usuario.correo_electronico) {
      return false; // Si falta algún dato obligatorio
    }
    if (this.usuario.tiene_auto === 'si') {
      // Si el usuario tiene auto, validar también la información del vehículo
      if (!this.usuario.marca_auto || !this.usuario.patente || !this.usuario.capacidad_asientos) {
        return false;
      }
    }
    return true;
  }
}

