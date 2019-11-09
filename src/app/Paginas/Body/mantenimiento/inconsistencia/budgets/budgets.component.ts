import { Component, OnInit } from '@angular/core';
import {BudgetsService} from "../../../../../Servicios/budgets/budgets.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {

  public pagina: number = 0;
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public budgetService: BudgetsService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.resetearVariable();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Budgets";
        return;
      }
      this.buscarInconsistencia();
    });
  }

  ngOnInit() {
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }
  public resetearVariable() {
    this.budgetService.Budgets = [];
    this.pagina = 0;
  }
  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Budgets';
      this.util.crearLoading().then(() => {
        this.budgetService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.budgetService.inconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  public resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msjLoading =  result.msj;
      this.util.msj =  result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.budgetService.Budgets = this.budgetService.Budgets.concat(result.budgets);
    }
    this.util.loadingMain = false;
  }

}
