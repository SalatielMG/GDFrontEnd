import { Component, OnInit } from '@angular/core';
import {CardviewsService} from '../../../../../Servicios/cardviews/cardviews.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-cardviews',
  templateUrl: './cardviews.component.html',
  styleUrls: ['./cardviews.component.css']
})
export class CardviewsComponent implements OnInit {

  public pagina: number = 0;
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public cardviewService: CardviewsService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.resetearVariables();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla CardViews";
        return;
      }
      this.buscarInconsistencia();
    });
  }

  ngOnInit() {
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }
  public resetearVariables(){
    this.cardviewService.Cardviews = [];
    this.pagina = 0;
  }
  public buscarInconsistencia(){
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla CardViews';
      this.util.crearLoading().then(() => {
        this.cardviewService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.cardviewService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }

  }
  public resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading =  result.msj;
      this.util.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.cardviewService.Cardviews = this.cardviewService.Cardviews.concat(result.cardviews);
    }
    this.util.loadingMain = false;
  }

}
