import { Component } from '@angular/core';
import {BudgetsService} from "../../../../../Servicios/budgets/budgets.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {ActivatedRoute, Router} from "@angular/router";
import {Budgets} from '../../../../../Modelos/budgets/budgets';
import {UsuarioService} from '../../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent {

  public budgetSelected: Budgets = new Budgets();
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public budgetService: BudgetsService, public util: Utilerias, private usuarioService: UsuarioService) {
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
    if (!this.util.loadingMain) this.buscarInconsistencia();
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
        this.util.QueryComplete.isComplete = result.budgets.length < this.util.limit_Inconsistencia;
      }
      this.budgetService.pagina += 1;
      this.budgetService.Budgets = this.budgetService.Budgets.concat(result.budgets);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }
  public accionCorregirRegistro(budget: Budgets, index) {
    this.budgetService.indexBudgetSelected = index;
    this.budgetSelected = budget;
    this.util.abrirModal("#modalBudget");
  }
  public corregirInconsistenciaRegistro() {
    let budget: any = {};
    budget["id_backup"] = this.budgetSelected.id_backup;
    budget["id_account"] = this.budgetSelected.id_account;
    budget["id_category"] = this.budgetSelected.id_category;
    budget["period"] = this.budgetSelected.period;
    budget["amount"] = this.budgetSelected.amount;
    budget["budget"] = this.budgetSelected.budget;
    this.util.msjLoading = "Corrigiendo inconsistencia del registro Budget con " + this.util.key_Names(budget);
    this.util.crearLoading().then(() => {
      this.budgetService.corregirInconsistenciaRegistro(budget, this.usuarioService.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.budget.error) {
            this.budgetService.Budgets[this.budgetService.indexBudgetSelected] = result.budget.budgets[0];
          } else {
            this.budgetService.Budgets[this.budgetService.indexBudgetSelected]["repeated"] = 1;
          }
          this.util.cerrarModal("#modalBudget");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });

  }
}
