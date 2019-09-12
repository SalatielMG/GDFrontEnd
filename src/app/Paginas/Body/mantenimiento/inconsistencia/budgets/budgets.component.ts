import { Component, OnInit } from '@angular/core';
import {BudgetsService} from "../../../../../Servicios/budgets/budgets.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {

  public msj;
  private pagina: number = 0;
  private faArrowUp = faArrowUp;

  constructor(private budgetService: BudgetsService, private util: Utilerias) {
    this.resetearVariable();
    this.buscarInconsistencia();
  }

  ngOnInit() {
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }
  private resetearVariable() {
    this.budgetService.Budgets = [];
    this.pagina = 0;
  }
  private buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.msj = 'Buscando inconsistencia de datos en la tabla Budgets';
      this.util.crearLoading().then(() => {
        this.budgetService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.budgetService.inconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.budgetService.Budgets = this.budgetService.Budgets.concat(result.budgets);
    }
    this.util.loadingMain = false;
  }

}
