import { Component, OnInit } from '@angular/core';
import {CardviewsService} from '../../../../../Servicios/cardviews/cardviews.service';
import {Utilerias} from '../../../../../Utilerias/Util';

@Component({
  selector: 'app-cardviews',
  templateUrl: './cardviews.component.html',
  styleUrls: ['./cardviews.component.css']
})
export class CardviewsComponent implements OnInit {

  public msj;

  constructor(private cardviewService: CardviewsService, private util: Utilerias) {
    this.msj = 'Buscando inconsistencia de datos en la tabla CardViews';
    this.util.crearLoading().then(() => {
      this.cardviewService.inconsistenciaDatos(this.util.emailUserMntInconsistencia).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.cardviewService.Cardviews = result.cardviews;
        }
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }

  ngOnInit() {
  }

}
