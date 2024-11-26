import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private fireStore: AngularFirestore, private fireAuth: AngularFireAuth, ) { }

  async crearUsuario(usuario: any){
    const docRef = this.fireStore.collection('usuarios').doc(usuario.rut);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
      return false;
    }
    
    const credencialesUsuario = await this.fireAuth.createUserWithEmailAndPassword(usuario.correo_electronico, usuario.contrasena)
    const uid = credencialesUsuario.user?.uid;

    await docRef.set({...usuario,uid});
    return true;

    //return this.fireStore.collection('usuarios').doc(usuario.rut).set(usuario);
  }

  async login(correo: string, contrasena: string): Promise<boolean> {
    try {
      // Intentar iniciar sesión con el correo y la contraseña proporcionados
      const usuarioCredential = await this.fireAuth.signInWithEmailAndPassword(correo, contrasena);
      
      // Si la autenticación es exitosa, el usuario ha iniciado sesión correctamente
      return usuarioCredential.user !== null; // Retorna true si el usuario ha sido autenticado
    } catch (error) {
      console.error('Error de autenticación:', error);
      return false; // Si hay un error (correo o contraseña incorrectos), retornar false
    }
  }
  
  getUsuarios(){
    return this.fireStore.collection('usuarios').valueChanges();
  }

  getUsuario(rut: string){
    return this.fireStore.collection('usuarios').doc(rut).valueChanges();
  }

  updateUsuario(usuario: any){
    return this.fireStore.collection('usuarios').doc(usuario.rut).update(usuario)
  }

  deleteUsuario(rut: string){
    return this.fireStore.collection('usuarios').doc(rut).delete();
  }

  async recuperarUsuario(correo_electronico: string): Promise<boolean> {
    try {
      await this.fireAuth.sendPasswordResetEmail(correo_electronico);  // Enviar correo de recuperación
      return true;  // Indicar que el correo fue enviado correctamente
    } catch (error) {
      console.error("Error al recuperar la contraseña:", error);
      return false;  // Si hay un error, retornar false
    }
  }

  async buscarPorRUT(rut: string): Promise<boolean> {
    const usuarioRef = await this.fireStore.collection('usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
    if (!usuarioRef) {
      return false; // Si no se pudo obtener el resultado, retornar falso
    }
    return usuarioRef.size > 0;  // Verifica si la colección tiene documentos
  }
  
  async buscarPorCorreo(correo: string): Promise<boolean> {
    const usuarioRef = await this.fireStore.collection('usuarios', ref => ref.where('correo_electronico', '==', correo)).get().toPromise();
    if (!usuarioRef) {
      return false; // Si no se pudo obtener el resultado, retornar falso
    }
    return usuarioRef.size > 0;  // Verifica si la colección tiene documentos
  }

}
