import { Component, OnInit } from '@angular/core';
import { PokeapiService } from 'src/app/services/pokeapi.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  pokemon: any;
  
  constructor(private pokeAPI: PokeapiService) { }

  ngOnInit() {
    this.getPokemon();
  }

  getPokemon(): void {
    this.pokeAPI.getRandomPokemon().subscribe((data) => {
        this.pokemon = data;
      },
      (error) => {
        console.error('Error fetching Pokémon:', error);
      }
    );
  }

}
