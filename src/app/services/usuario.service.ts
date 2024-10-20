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
      "rut": "16666666-6",
      "nombre": "alambrito",
      "fecha_nacimiento": "1990-03-24",
      "genero": "Masculino",
      "correo": "admin@duocuc.cl",
      "contrasena": "Admin123.",
      "valida_contrasena": "Admin123.",
      "tiene_equipo": "no",
      "nombre_equipo": "",
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

  public async login(correo: string, contrasena: string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(elemento=> elemento.correo==correo && elemento.contrasena==contrasena);
  }

  public async recuperarUsuario(correo:string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(elemento=> elemento.correo == correo);
  }

}
