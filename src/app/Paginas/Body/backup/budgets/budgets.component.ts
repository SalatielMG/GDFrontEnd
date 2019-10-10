import { Component, OnInit } from '@angular/core';
import { BudgetsService } from '../../../../Servicios/budgets/budgets.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {

  private option: string = "";
  private budgets: FormGroup;
  private indexUniqueBudgetSelected = {};
  private indexBudgetSelectModal: number = 0;

  constructor( private route: ActivatedRoute,
               private router: Router, private budgetService: BudgetsService,  private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.budgetService.id_backup = params.get("idBack");
      this.budgetService.resetVariables();
      this.searchBudgets();
      console.log('Valor de id Backup', params.get('idBack'));
      // this.idBack = params.get('idBack');
    });
  }

  ngOnInit() {
  }

  private onScroll() {
    if (!this.budgetService.isFilter()) this.searchBudgets();
  }

  private searchBudgets() {
    this.util.loadingMain = true;
    if (this.budgetService.pagina == 0) {
      this.util.msjLoading = 'Buscando budgest relacionados con el id_backup: ' + this.budgetService.id_backup;
      this.util.crearLoading().then(() => {
        this.budgetService.buscarBudgetsBackup().subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.budgetService.buscarBudgetsBackup().subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }

  private resultado(result) {
    if (this.budgetService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.budgetService.Budgets = this.budgetService.Budgets.concat(result.budgets);
      this.util.QueryComplete.isComplete = false;
      // Accounts ***
      this.AccountsAndCategoriesBackup(result);
      if (this.budgetService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.budgets.length < this.util.limit;
      }
      this.budgetService.pagina += 1;
    } else {
      this.util.QueryComplete.isComplete = this.budgetService.pagina != 0;
    }
    this.util.loadingMain = false;
  }
  private AccountsAndCategoriesBackup(result) {
    if (!result.accountsBackup.error) {
      this.budgetService.AccountsBackup = result.accountsBackup.accounts;
      console.log("this.budgetService.AccountsBackup", this.budgetService.AccountsBackup);
    } else {
      this.util.msjToast(result.accountsBackup.msj, "", result.accountsBackup.error);
    }
  }

}
