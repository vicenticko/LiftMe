import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {

  id: number = 0;
  viaje: any;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //console.log(this.activatedRoute.snapshot.paramMap.get("id"));
    this.id = +(this.activatedRoute.snapshot.paramMap.get("id") || "");
    //ahora llamo al servicio de viaje, a un metodo llamado getViaje(this.id)
  }

}
