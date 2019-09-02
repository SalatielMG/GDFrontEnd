import { Component, OnInit } from '@angular/core';
import {CurrenciesService} from '../../../../../Servicios/currencies/currencies.service';
import {Utilerias} from '../../../../../Utilerias/Util';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {

  public msj;

  constructor(private currenciesService: CurrenciesService, private util:Utilerias) {
    this.msj = 'Buscando inconsistencia de datos en la tabla Currencies';
    this.util.crearLoading().then(() => {
      this.currenciesService.inconsistenciaDatos(this.util.emailUserMntInconsistencia).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.currenciesService.Currencies = result.currencies;
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
