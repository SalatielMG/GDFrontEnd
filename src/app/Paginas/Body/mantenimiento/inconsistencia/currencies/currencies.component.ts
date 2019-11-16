import { Component } from '@angular/core';
import {CurrenciesService} from '../../../../../Servicios/currencies/currencies.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent {

  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public currenciesService: CurrenciesService, public util:Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Currencies";
        return;
      }
      this.currenciesService.resetVariables();
      this.buscarInconsistencia();
    });
  }
  public onScroll() {
    if (this.currenciesService.isFilter() && !this.util.loadingMain) {
      this.buscarInconsistencia();
    }
  }
  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.currenciesService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Currencies';
      this.util.crearLoading().then(() => {
        this.currenciesService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.currenciesService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result) {
    this.util.msj = result.msj;
    if (this.currenciesService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.currenciesService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.currencies.length < this.util.limit;
      }
      this.currenciesService.pagina += 1;
      this.currenciesService.Currencies  = this.currenciesService.Currencies.concat(result.currencies);
    } else {
      this.util.QueryComplete.isComplete = this.currenciesService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

}
