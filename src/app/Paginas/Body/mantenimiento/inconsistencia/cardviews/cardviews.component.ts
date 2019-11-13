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

  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public cardviewService: CardviewsService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla CardViews";
        return;
      }
      this.cardviewService.resetVariables();
      this.buscarInconsistencia();
    });
  }

  ngOnInit() {
    this.util.ready();
  }
  public onScroll() {
    if (!this.cardviewService.isFilter() && !this.util.loadingMain) this.buscarInconsistencia();
  }
   public buscarInconsistencia(){
    this.util.loadingMain = true;
     if (this.cardviewService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla CardViews';
      this.util.crearLoading().then(() => {
        this.cardviewService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.cardviewService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }

  }
  public resultado(result) {
    this.util.msj = result.msj;
    if (this.cardviewService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.cardviewService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.cardviews.length < this.util.limit;
      }
      this.cardviewService.pagina += 1;
      this.cardviewService.Cardviews = this.cardviewService.Cardviews.concat(result.cardviews);
    } else {
      this.util.QueryComplete.isComplete = this.cardviewService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

}
