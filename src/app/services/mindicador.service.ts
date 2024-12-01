import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MindicadorService {

  url_mindicador = 'https://mindicador.cl/api'

  constructor(private http: HttpClient) { }

  obtenerValorDolar(): Observable<any> {
    return this.http.get<any>(this.url_mindicador);
  }
}
