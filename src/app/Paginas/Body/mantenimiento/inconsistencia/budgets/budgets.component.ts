import { Component, OnInit } from '@angular/core';
import {BudgetsService} from "../../../../../Servicios/budgets/budgets.service";
import {Utilerias} from "../../../../../Utilerias/Util";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {

  public msj;

  constructor(private budgetService: BudgetsService, private util: Utilerias) {
    this.msj = 'Buscando inconsistencia de datos en la tabla Budgets';
    this.util.crearLoading().then(() => {
      this.budgetService.inconsistenciaDatos().subscribe(result => {
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
  }

  ngOnInit() {
  }

}
