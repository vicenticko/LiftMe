import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  showPassword = false;

  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{7,8}-[0-9Kk]{1}$"), this.validarRUT()]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z]{3,20}")]),
    apellido: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z]{3,20}")]),
    genero: new FormControl('', [Validators.required]), 
    fecha_nacimiento: new FormControl('', [Validators.required]),
    correo_electronico: new FormControl('',[Validators.required, Validators.pattern("[a-zA-Z0-9.]+(@duocuc.cl)")]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
    confirmarContrasena: new FormControl('', [Validators.required]),

    tiene_auto: new FormControl('no',[Validators.required]),
    patente: new FormControl('', [Validators.pattern("^[A-Z]{2}[A-Z]{2}[0-9]{2}$")]),
    capacidad_asientos: new FormControl('', [Validators.min(1), Validators.max(8)]),

    tipo_usuario: new FormControl('', [Validators.required])
  });

  usuarios: any[] = [];
  botonModificar: boolean = true;

  constructor(private usuarioService: UsuarioService, private alertController: AlertController) { }

  async ngOnInit() {
    this.usuarios = await this.usuarioService.getUsuarios();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async registrar() {
    if (!this.validarEdad18(this.usuario.controls.fecha_nacimiento.value || "")) {
      await this.mostrarAlerta("Error", "Debe ser mayor de 18 años para registrarse!");
      return;
    }

    if (this.usuario.controls.contrasena.value !== this.usuario.controls.confirmarContrasena.value) {
      await this.mostrarAlerta("Error", "Las contraseñas no coinciden!");
      return;
    }

    if (await this.usuarioService.createUsuario(this.usuario.value)) {
      await this.mostrarAlerta("Éxito", "Usuario creado con éxito!");
      this.usuario.reset();
      this.usuarios = await this.usuarioService.getUsuarios();
    } else {
      await this.mostrarAlerta("Error", "No se pudo crear el Usuario");
    }
  }

  validarEdad18(fecha_nacimiento: string) {
    var edad = 0;
    if (fecha_nacimiento) {
      const fecha_date = new Date(fecha_nacimiento);
      const timeDiff = Math.abs(Date.now() - fecha_date.getTime());
      edad = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    }
    return edad >= 18;
  }

  validarRUT(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rutValue = control.value;
      if (!rutValue) return null;

      const [rutBody, dvIngresado] = rutValue.split('-');
      if (!rutBody || !dvIngresado) return { invalidRUT: true };

      const dvCalculado = this.calcularDigitoVerificador(rutBody);
      return dvCalculado.toLowerCase() === dvIngresado.toLowerCase() ? null : { invalidRUT: true };
    };
  }

  calcularDigitoVerificador(rut: string): string {
    let suma = 0;
    let multiplicador = 2;

    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    if (resto === 11) return '0';
    if (resto === 10) return 'K';
    return resto.toString();
  }

  async buscar(rut_buscar: string) {
    this.usuario.setValue(await this.usuarioService.getUsuario(rut_buscar));
    this.botonModificar = false;
  }

  async modificar() {
    var rut_buscar: string = this.usuario.controls.rut.value || "";
    if (await this.usuarioService.updateUsuario(rut_buscar, this.usuario.value)) {
      await this.mostrarAlerta("Éxito", "Usuario modificado con éxito!");
      this.botonModificar = true;
      this.usuario.reset();
      this.usuarios = await this.usuarioService.getUsuarios();
    } else {
      await this.mostrarAlerta("Error", "Usuario no modificado!");
    }
  }

  async eliminar(rut_eliminar: string) {
    if (await this.usuarioService.deleteUsuario(rut_eliminar)) {
      await this.mostrarAlerta("Éxito", "Usuario eliminado con éxito!");
      this.usuarios = await this.usuarioService.getUsuarios();
    } else {
      await this.mostrarAlerta("Error", "Usuario no eliminado!");
    }
  }

  // Método para mostrar alertas usando AlertController
  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
