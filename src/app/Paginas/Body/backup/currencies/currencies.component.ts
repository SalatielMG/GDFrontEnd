import { Component, OnInit } from '@angular/core';
import { CurrenciesService } from '../../../../Servicios/currencies/currencies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilerias } from '../../../../Utilerias/Util';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
  public msj;

  constructor( private route: ActivatedRoute,
               private router: Router, private currenciesService: CurrenciesService, private util: Utilerias) {

    this.route.parent.paramMap.subscribe(params => {
      this.msj = 'Buscando Currencies relacionados con el id_backup';
      this.util.crearLoading().then(() => {
        this.currenciesService.buscarCurrenciesBackup(params.get('idBack')).subscribe(result => {
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
      console.log('Valor de id Backup', params.get('idBack'));
      // this.idBack = params.get('idBack');
    });
  }


  ngOnInit() {
  }

}
