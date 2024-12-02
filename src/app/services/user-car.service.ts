import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCarService {

  private baseUrl = 'https://car-api2.p.rapidapi.com/'; // Cambia por la URL de la API que estás usando
  private headers = new HttpHeaders({
    'X-RapidAPI-Key': 'b6afd04023msheb37f6814bb0c9ap1ea989jsn9a82f42af20e', // Reemplaza con tu clave API
    'X-RapidAPI-Host': 'car-api2.p.rapidapi.com',
    
  });

  constructor(private http: HttpClient) { }

  

  // Obtener las marcas de autos
getCarBrands(): Observable<any> {
  return this.http.get<any[]>(`${this.baseUrl}api/makes`, { headers: this.headers });
}

  
}