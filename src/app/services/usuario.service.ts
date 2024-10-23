import { Injectable } from '@angular/core';
//se agregaba el import de Storage: storage-angular
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //y en el constructor se crea una variable del módulo:
  constructor(private storage: Storage) {
    this.init();
  }

  async init(){
    await this.storage.create();
    let admin = {
      "rut": "11111111-1",
      "nombre": "admin",
      "apellido":"",
      "genero": "Masculino",
      "fecha_nacimiento": "2006-06-06",
      "correo_electronico": "admin@duocuc.cl",
      "contrasena": "admin123456",
      "confirmarContrasena": "admin123456",
      "tiene_auto": "no",
      "patente": "",
      "capacidad_asientos":"",
      "tipo_usuario": "Administrador"
    };
    await this.createUsuario(admin);
  }

  //aquí vamos a crear toda nuestra lógica de programación
  //DAO:
  public async createUsuario(usuario:any): Promise<boolean>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    if(usuarios.find(usu=>usu.rut==usuario.rut)!=undefined){
      return false;
    }
    usuarios.push(usuario);
    await this.storage.set("usuarios",usuarios);
    return true;
  }

  public async getUsuario(rut:string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(usu=>usu.rut==rut);
  }

  public async getUsuarios(): Promise<any[]>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios;
  }

  public async updateUsuario(rut:string, nuevoUsuario:any): Promise<boolean>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if(indice==-1){
      return false;
    }
    usuarios[indice] = nuevoUsuario;
    await this.storage.set("usuarios",usuarios);
    return true;
  }

  public async deleteUsuario(rut:string): Promise<boolean>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if(indice==-1){
      return false;
    }
    usuarios.splice(indice,1);
    await this.storage.set("usuarios",usuarios);
    return true;
  }

  public async login(correo_electronico: string, contrasena: string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    const usu =  usuarios.find(elemento=> elemento.correo_electronico==correo_electronico && elemento.contrasena==contrasena);
    if(usu){
      //localStorage almacena la información SI o SI como String:
      localStorage.setItem("usuario", JSON.stringify(usu) );
      return true;
    }
    return false;
  }

  public async recuperarUsuario(correo_electronico:string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(elemento=> elemento.correo_electronico == correo_electronico);
  }

}
