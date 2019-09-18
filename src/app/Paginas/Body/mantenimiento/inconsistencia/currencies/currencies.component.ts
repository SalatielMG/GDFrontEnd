import { Component, OnInit } from '@angular/core';
import {CurrenciesService} from '../../../../../Servicios/currencies/currencies.service';
import {Utilerias} from '../../../../../Utilerias/Util';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {

  private pagina: number = 0;

  constructor(private currenciesService: CurrenciesService, private util:Utilerias) {
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
    this.currenciesService.Currencies = [];
    this.pagina = 0;
  }
  private buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Currencies';
      this.util.crearLoading().then(() => {
        this.currenciesService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.currenciesService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.currenciesService.Currencies = this.currenciesService.Currencies.concat(result.currencies);
    }
    this.util.loadingMain = false;
  }

}
