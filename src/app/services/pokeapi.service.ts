import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  url_pokeapi = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(private http: HttpClient) {}

  getRandomPokemon(): Observable<any> {
    const randomId = Math.floor(Math.random() * 1010) + 1; // Hay 1010 Pokémon en total
    return this.http.get<any>(`${this.url_pokeapi}${randomId}`);
  }

}
