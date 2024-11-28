import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private fireStore: AngularFirestore, private fireAuth: AngularFireAuth) { }

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
      const usuarioCredential = await this.fireAuth.signInWithEmailAndPassword(correo, contrasena);
      return usuarioCredential.user !== null;
    } catch (error) {
      console.error('Error de autenticación:', error);
      return false;
    }
  }

  async getUsuarioPorCorreo(correo: string): Promise<any> {
    const usuarioRef = await this.fireStore.collection('usuarios', ref => ref.where('correo_electronico', '==', correo)).get().toPromise();
  
    // Verificamos si usuarioRef no es undefined y si tiene documentos
    if (usuarioRef && !usuarioRef.empty) {
      return usuarioRef.docs[0].data();  // Retorna el primer documento encontrado
    }
  
    return null;  // Si no hay usuarios con ese correo
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
