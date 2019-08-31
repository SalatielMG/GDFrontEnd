import { Component, OnInit } from '@angular/core';
import { BudgetsService } from '../../../../Servicios/budgets/budgets.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {
  public msj;

  constructor( private route: ActivatedRoute,
               private router: Router, private budgetService: BudgetsService,  private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.msj = 'Buscando Budgest relacionados con el backup';
      this.util.crearLoading().then(() => {
        this.budgetService.buscarBudgetsBackup(params.get('idBack')).subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          if (!result.error) {
            this.budgetService.Budgets = result.budgets;
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
