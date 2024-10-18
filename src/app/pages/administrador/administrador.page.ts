import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{7,8}-[0-9Kk]{1}$"), this.validarRUT()]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z]{3,20}")]),
    apellido: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z]{3,20}")]),
    genero: new FormControl('', [Validators.required]), 
    fecha_nacimiento: new FormControl('', [Validators.required]),
    correo_electronico: new FormControl('',[Validators.required, Validators.pattern("[a-zA-Z0-9.]+(@duocuc.cl)")]),
    contraseña: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
    confirmarContraseña: new FormControl('', [Validators.required]),

    tiene_auto: new FormControl('no',[Validators.required]),
    patente: new FormControl('', [Validators.pattern("^[A-Z]{2}[A-Z]{2}[0-9]{2}$")]),
    capacidad_asientos: new FormControl('', [Validators.min(1), Validators.max(8)]),

    tipo_usuario: new FormControl('', [Validators.required])
  });
  usuarios:any[] = [];
  botonModificar: boolean = true;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  public registrar():void{
    if( !this.validarEdad18(this.usuario.controls.fecha_nacimiento.value || "") ){
      alert("Deebe ser mayor de 18 años para registrarse!");
      return;
    }
    
    if(this.usuario.controls.contraseña.value != this.usuario.controls.confirmarContraseña.value){
      alert("Las contraseñas no coinciden!");
      return;
    }

    if(this.usuarioService.createUsuario(this.usuario.value)){
      this.usuario.reset();
      alert("Usuario creado con éxito!")
    }
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

  buscar(rut_buscar:string){
    this.usuario.setValue( this.usuarioService.getUsuario(rut_buscar) );
    this.botonModificar = false;
  }

  modificar(){
    var rut_buscar: string = this.usuario.controls.rut.value || "";
    if(this.usuarioService.updateUsuario( rut_buscar , this.usuario.value)){
      alert("Usuario modificado con Exito!");
      this.botonModificar = true;
      this.usuario.reset();
    }else{
      alert("Usuario no Modificado!");
    }
  }

  eliminar(rut_eliminar:string){
    if( this.usuarioService.deleteUsuario(rut_eliminar) ){
      alert("Usuario eliminado con Exito!")
    }else{
      alert("Usuario no Eliminado!")
    }
  }

}
