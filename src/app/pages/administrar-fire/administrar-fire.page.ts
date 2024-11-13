import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrar-fire',
  templateUrl: './administrar-fire.page.html',
  styleUrls: ['./administrar-fire.page.scss'],
})
export class AdministrarFirePage implements OnInit {

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
    marca_auto: new FormControl(''),

    tipo_usuario: new FormControl('', [Validators.required])
  });

  usuarios: any[] = [];
  botonModificar: boolean = true;

  constructor(private usuarioService: UsuarioService, private alertController: AlertController, private fireService: FireService) {
    this.usuario.get("rut")?.setValidators([Validators.required,Validators.pattern("^[0-9]{7,8}-[0-9Kk]{1}$"),this.validarRUT()]);
  }

  async ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios(){
    this.fireService.getUsuarios().subscribe(data=>{
      this.usuarios = data;
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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

  async registrar() {
    if (!this.validarEdad18(this.usuario.controls.fecha_nacimiento.value || "")) {
      await this.mostrarAlerta("Error", "Debe ser mayor de 18 años para registrarse!");
      return;
    }

    if (this.usuario.controls.contrasena.value !== this.usuario.controls.confirmarContrasena.value) {
      await this.mostrarAlerta("Error", "Las contraseñas no coinciden!");
      return;
    }

    if (await this.fireService.crearUsuario(this.usuario.value)) {
      await this.mostrarAlerta("Éxito", "¡Usuario registrado!");
      this.usuario.reset();
    } else {
      await this.mostrarAlerta("Error", "¡Error! El usuario ya existe.");
    }
  }

  async buscar(usuario: any){
    this.usuario.setValue(usuario);
    this.botonModificar = false;
  }

  async modificar() {
    this.fireService.updateUsuario(this.usuario.value).then(async () => {
        await this.mostrarAlerta("Éxito", "¡Usuario modificado!");
        this.usuario.reset();
      })
      .catch(async (error) => {
        await this.mostrarAlerta("Error", "Hubo un problema al modificar el usuario.");
        console.log("ERROR: " + error);
      });
  }

  async eliminar(rut_eliminar:string){
    this.fireService.deleteUsuario(rut_eliminar);
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
