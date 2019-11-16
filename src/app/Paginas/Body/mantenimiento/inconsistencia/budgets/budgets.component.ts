import { Component } from '@angular/core';
import {BudgetsService} from "../../../../../Servicios/budgets/budgets.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent {

  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public budgetService: BudgetsService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Budgets";
        return;
      }
      this.budgetService.resetVariables();
      this.buscarInconsistencia();
    });
  }
  public onScroll() {
    if (!this.budgetService.isFilter() && !this.util.loadingMain) this.buscarInconsistencia();
  }
  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.budgetService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Budgets';
      this.util.crearLoading().then(() => {
        this.budgetService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.budgetService.inconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result) {
    this.util.msj = result.msj;
    if (this.budgetService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.budgetService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.budgets.length < this.util.limit;
      }
      this.budgetService.pagina += 1;
      this.budgetService.Budgets = this.budgetService.Budgets.concat(result.budgets);
    } else {
      this.util.QueryComplete.isComplete = this.budgetService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

}
