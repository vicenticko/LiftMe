import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireViajeService {

  constructor(private fireStore: AngularFirestore, private fireAuth: AngularFireAuth) { }

  public async createViaje(viaje: any): Promise<boolean> {
    const viajesRef = this.getViajesCollection();

    // Verifica si el viaje ya existe en Firebase
    const viajesSnapshot = await viajesRef.ref.where('id', '==', viaje.id).get();

    // Si ya existe un viaje con ese id, retorna false
    if (!viajesSnapshot.empty) {
      return false;
    }

    // Si no existe, agrega el nuevo viaje a Firebase
    await viajesRef.add(viaje);

    return true;
  }

   // Función para obtener la colección de viajes
   private getViajesCollection() {
    return this.fireStore.collection('viajes'); // Asegúrate de que 'viajes' sea el nombre correcto de tu colección en Firestore
  }

  public async getViajes(): Promise<any[]> {
    const viajesSnapshot = await this.getViajesCollection().get().toPromise(); // Obtener todos los documentos de la colección
    
    if (!viajesSnapshot || viajesSnapshot.empty) { // Comprobamos que 'viajesSnapshot' no sea 'undefined' ni esté vacío
      return []; // Retorna un arreglo vacío si no hay viajes
    }

    const viajes: any[] = viajesSnapshot.docs.map(doc => doc.data()); // Convertir los documentos a un arreglo
    return viajes;
  }

  public async getViaje(id: string): Promise<any> {
    const viajesSnapshot = await this.getViajesCollection().ref.where('id', '==', id).get();

    // Si no se encuentra ningún viaje con el id dado
    if (viajesSnapshot.empty) {
      return null; // Retorna null si no se encuentra el viaje
    }

    // Si se encuentra, retorna los datos del primer documento encontrado
    return viajesSnapshot.docs[0].data();
  }

  public async deleteViaje(id: string): Promise<boolean> {
    // Consulta para encontrar el documento con el 'id' proporcionado
    const viajesSnapshot = await this.getViajesCollection().ref.where('id', '==', id).get();

    // Verifica si se encontró un viaje con el 'id'
    if (viajesSnapshot.empty) {
      return false; // Si no se encuentra el viaje, retornamos 'false'
    }

    // Si se encuentra el viaje, obtenemos el primer documento (ya que 'id' es único)
    const viajeDoc = viajesSnapshot.docs[0];

    // Eliminar el documento de Firestore
    await viajeDoc.ref.delete();

    return true; // Retorna 'true' si el viaje fue eliminado correctamente
  }

}
