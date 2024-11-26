import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  showPassword = false;

  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9Kk]{1}"), this.validarRUT()]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-zÑñ]+(\\s[A-Za-zÑñ]+)*$")]),
    apellido: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-zÑñ]+(\\s[A-Za-zÑñ]+)*$")]),
    genero: new FormControl('', [Validators.required]), 
    fecha_nacimiento: new FormControl('', [Validators.required]),
    correo_electronico: new FormControl('',[Validators.required, Validators.pattern("[A-Za-zÑñ0-9.]+(@duocuc.cl)")]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
    confirmarContrasena: new FormControl('', [Validators.required]),
    tipo_usuario: new FormControl('Usuario'),

    tiene_auto: new FormControl('no',[Validators.required]),
    patente: new FormControl('', [Validators.pattern("^[A-Z]{2}[A-Z]{2}[0-9]{2}$")]),
    capacidad_asientos: new FormControl('', [Validators.min(1), Validators.max(8)]),
    marca_auto: new FormControl(''),
  });

  constructor(private router: Router, private usuarioService: UsuarioService, private alertController: AlertController, private fireService: FireService) {
    this.usuario.get("rut")?.setValidators([Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}"),this.validarRUT()]);
   }

  ngOnInit() {
  }
  
  async registrar() {
    const rut = this.usuario.controls.rut.value;
    const correo = this.usuario.controls.correo_electronico.value;
  
    // Verificar si el RUT es válido y no nulo
    if (rut && await this.fireService.buscarPorRUT(rut)) {
      await this.mostrarAlerta("Error", "El RUT ya está registrado.");
      return;
    }
  
    // Verificar si el correo es válido y no nulo
    if (correo && await this.fireService.buscarPorCorreo(correo)) {
      await this.mostrarAlerta("Error", "El correo electrónico ya está registrado.");
      return;
    }
  
    // Verificar si el usuario tiene 18 años o más
    if (!this.validarEdad18(this.usuario.controls.fecha_nacimiento.value || "")) {
      await this.mostrarAlerta("Error", "Debe ser mayor de 18 años para registrarse!");
      return;
    }
  
    // Verificar si las contraseñas coinciden
    if (this.usuario.controls.contrasena.value !== this.usuario.controls.confirmarContrasena.value) {
      await this.mostrarAlerta("Error", "Las contraseñas no coinciden!");
      return;
    }
  
    // Si todo es correcto, crear el usuario
    if (await this.fireService.crearUsuario(this.usuario.value)) {
      await this.mostrarAlerta("Éxito", "Usuario creado con éxito!");
      this.usuario.reset();
  
      // Redirigir al login después de un registro exitoso
      this.router.navigate(['/login']);
    } else {
      await this.mostrarAlerta("Error", "No se pudo crear el Usuario");
    }
  }
  
  
  

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validarEdad18(fecha_nacimiento: string){
    var edad = 0;
    if(fecha_nacimiento){
      const fecha_date = new Date(fecha_nacimiento);
      const timeDiff = Math.abs(Date.now() - fecha_date.getTime());
      edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    }
    if(edad>=18){
      return true;
    }else{
      return false;
    }
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
