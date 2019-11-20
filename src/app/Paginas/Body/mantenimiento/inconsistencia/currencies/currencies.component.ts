import { Component } from '@angular/core';
import {CurrenciesService} from '../../../../../Servicios/currencies/currencies.service';
import {Utilerias} from '../../../../../Utilerias/Util';
import {ActivatedRoute, Router} from "@angular/router";
import {Currencies} from '../../../../../Modelos/currencies/currencies';
import {UsuarioService} from '../../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent {

  public currencySelected: any = new Currencies();
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public currenciesService: CurrenciesService, public util:Utilerias, private usuarioService: UsuarioService) {
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
    if (!this.util.loadingMain) {
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
        this.util.QueryComplete.isComplete = result.currencies.length < this.util.limit_Inconsistencia;
      }
      this.currenciesService.pagina += 1;
      this.currenciesService.Currencies  = this.currenciesService.Currencies.concat(result.currencies);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }
  public accionCorregirRegistro(currency: Currencies, index) {
    this.currenciesService.indexCurrencySelected = index;
    this.currencySelected = currency;
    this.util.abrirModal("#modalCurrency");
  }
  public corregirInconsistenciaRegistro() {
    let currency: any = {};
    currency["id_backup"] = this.currencySelected.id_backup;
    currency["iso_code"] = this.currencySelected.iso_code;
    this.util.msjLoading = "Corrgiiendo inconsistencias del registro Currency con " + this.util.key_Names(currency);
    this.util.crearLoading().then(() => {
      this.currenciesService.corregirInconsistenciaRegistro(currency, this.usuarioService.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.currency.error) {
            this.currenciesService.Currencies[this.currenciesService.indexCurrencySelected] = result.currency.currencies[0];
          } else {
            this.currenciesService.Currencies[this.currenciesService.indexCurrencySelected]["repeated"] = 1;
          }
          this.util.cerrarModal("#modalCurrency");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

}
