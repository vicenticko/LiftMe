import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UserCarService } from 'src/app/services/user-car.service'; // Asegúrate de importar correctamente el servicio de autos

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
  carBrands: string[] = [];  // Inicializar como array vacío
 
  

  constructor(
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private router: Router,
    private fireService: FireService,
    private userCarService: UserCarService // Asegúrate de inyectar el servicio de autos
  ) { }

  ngOnInit() {
    // Cargar datos del usuario desde localStorage al inicializar la página
    const datosUsuario = localStorage.getItem('usuario');
    if (datosUsuario) {
      this.usuario = JSON.parse(datosUsuario); // Convertir el JSON en un objeto
    }

    // Cargar marcas de autos al iniciar
    this.GetCarBrands();
    
  }

  // Función para cargar marcas de autos desde la API
  GetCarBrands() {
    this.userCarService.getCarBrands().subscribe(
      (response: any) => {
        this.carBrands = response; // Aquí deberías asignar el resultado a carBrands
      },
      (error) => {
        console.error('Error al cargar las marcas de autos:', error);
      }
    );
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

  async guardarPerfil() {
    console.log('Datos del usuario antes de guardar:', this.usuario);
    try {
      if (this.validarCampos()) {
        // Guardar los datos en localStorage
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        console.log('Datos guardados en localStorage:', localStorage.getItem('usuario'));

        // Actualizar los datos en Firebase
        await this.fireService.updateUsuario(this.usuario);
        console.log('Datos actualizados en Firebase.');

        // Crear la alerta de éxito
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Información guardada con éxito.',
          buttons: ['OK']
        });
        await alert.present();

        // Redirigir a la página de perfil
        this.router.navigate(['/home/perfil']);
      } else {
        // Crear la alerta de error si no se completan los campos
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Por favor, completa todos los campos obligatorios.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      console.error('Error al guardar en Firebase:', error);

      // Crear la alerta de error en caso de que ocurra un problema al guardar
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al guardar la información.',
        buttons: ['OK']
      });
      await alert.present();
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
