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
  private pagina: number = 0;

  constructor(private cardviewService: CardviewsService, private util: Utilerias) {
    this.resetearVariables();
    this.buscarInconsistencia();
  }

  ngOnInit() {
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }
  private resetearVariables(){
    this.cardviewService.Cardviews = [];
    this.pagina = 0;
  }
  private buscarInconsistencia(){
    if (this.pagina == 0) {
      this.msj = 'Buscando inconsistencia de datos en la tabla CardViews';
      this.util.crearLoading().then(() => {
        this.cardviewService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.cardviewService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }

  }
  private resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.cardviewService.Cardviews = this.cardviewService.Cardviews.concat(result.cardviews);
    }
  }

}
