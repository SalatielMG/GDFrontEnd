import { Component, OnInit } from '@angular/core';
import { BudgetsService } from '../../../../Servicios/budgets/budgets.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Budgets} from '../../../../Modelos/budgets/budgets';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {

  private option: string = "";
  private budget: FormGroup = null;
  private indexUniqueBudgetSelected = {};
  private indexBudgetSelectModal: number = 0;

  constructor( private route: ActivatedRoute,
               private router: Router, private budgetService: BudgetsService,  private util: Utilerias, private formBuilder: FormBuilder) {
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
    this.util.msj = result.msj;
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

  private accionBudget(option, budget = new Budgets(), i = null) {
    this.util.msjLoading = "Cargando cuentas y categorias del backup: " + this.budgetService.id_backup;
    this.util.crearLoading().then(() => {
      this.budgetService.obtAccountsBackup().then(error => {
        if (!error && error != 400) {
          console.log("Open this modal :)", error);
          this.option = option;
          this.buildForm(budget);
          if (this.option != this.util.AGREGAR) {
            this.indexUniqueBudgetSelected["id_backup"] = budget.id_backup;
            this.indexUniqueBudgetSelected["id_account"] = budget.id_account;
            this.indexUniqueBudgetSelected["id_category"] = budget.id_category;
            this.budgetService.indexBudgetSelected = i;
            if (this.budgetService.isFilter()) {
              this.budgetService.indexBudgetSelected = <number>this.budgetService.Budgets.indexOf(budget);
              this.budgetService.indexBudgetFilterSelected = i;
            }
            this.budgetService.AccountsBackup.forEach((a, index) => {
              if (a.id_account.toString() == budget.id_account.toString()) {
                this.indexBudgetSelectModal = index + 1;
              }
            });
          } else {

          }
          setTimeout(()=> {
            this.util.detenerLoading();
            this.util.abrirModal("#modalBudget");

          }, 1000);

        } else {
          this.util.detenerLoading();
          this.util.msjToast((error == 400) ? "Ocurrio un error interno del servidor": "No se encontraron registros de cuentas y categorias asociadas con el id_backup: " + this.budgetService.id_backup, "¡ -- ERROR -- !", (error == 400) ? "warning": true);
          console.log("No open this modal :(", error)
        }
      });
    });
  }

  private buildForm(budget: Budgets) {
    console.log("Construyendo form");
    this.budget = this.formBuilder.group({
      id_backup : [budget.id_backup, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("10"))]],
      id_account : [(this.option == this.util.AGREGAR) ? "": budget.id_account, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      id_category : [(this.option == this.util.AGREGAR) ? "": budget.id_category, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("5"))]],
      period : [budget.period, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
      amount : [(this.option == this.util.AGREGAR) ? budget.amount : this.util.unZeroFile(budget.amount), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      budget : [(this.option == this.util.AGREGAR) ? budget.budget : this.util.unZeroFile(budget.budget), [Validators.required, Validators.min(0), Validators.pattern(this.util.exprRegular_6Decimal)]],
      initial_date : [(this.option == this.util.AGREGAR) ? new Date() : this.util.formatComponentDateCalendar(budget.initial_date)],
      final_date : [(this.option == this.util.AGREGAR) ? new Date() :  this.util.formatComponentDateCalendar(budget.final_date)],
      number : [budget.number, [Validators.required, Validators.min(0), Validators.pattern(this.util.reegex_MaxLengthNumber("4"))]],
    });
    if (this.util.isDelete(this.option)) this.disableForm();

  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.budget.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }
  private disableForm() {
    for (let key in this.budget.getRawValue()) {
      this.budget.get(key).disable();
    }
    this.budget.disable();
  }
  private closeModal() {
    this.util.cerrarModal("#modalBudget").then(() => {
      console.log("Modal cerrado :v");
      this.option = "";
      this.budget = null;
    });
  }
  private operation() {
    switch (this.option) {
      case this.util.AGREGAR:
        this.agregarBudget();
        break;
      case this.util.ACTUALIZAR:
        this.actualizarBudget();
        break;
      case this.util.ELIMINAR:
        this.eliminarBudget();
        break;
    }
  }
  private agregarBudget() {
    this.budget.patchValue({id_backup: this.budgetService.id_backup});
    this.budget.patchValue({initial_date: this.util.formatDateTimeSQL( this.budget,"initial_date", false)});
    this.budget.patchValue({final_date: this.util.formatDateTimeSQL( this.budget,"final_date", false)});
    this.addZeroDecimalValue();
    this.util.msjLoading = "Agregando presupuesto de la cuenta con id_account: " + this.budget.value.id_account + ", categoria con id_category: " + this.budget.value.id_category + " del Respaldo Id_backup: " + this.budgetService.id_backup;
    this.util.crearLoading().then(() => {
      this.budgetService.agregarBudget(this.budget.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          if (this.util.QueryComplete.isComplete || this.budgetService.Budgets.length == 0) {
            if (!result.budget.error) {
              this.budgetService.Budgets.push(result.budget.new);
              if (this.budgetService.isFilter()) this.budgetService.proccessFilter();
            } else {
              this.util.msjToast(result.budget.msj, this.util.errorRefreshListTable, result.budget.error);
            }
          }
          this.closeModal();
        } else {
          this.budget.patchValue({initial_date: this.util.formatComponentDateCalendar( this.budget.value.initial_date)});
          this.budget.patchValue({final_date: this.util.formatComponentDateCalendar( this.budget.value.final_date)});
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private actualizarBudget() {
    this.budget.patchValue({initial_date: this.util.formatDateTimeSQL( this.budget,"initial_date", false)});
    this.budget.patchValue({final_date: this.util.formatDateTimeSQL( this.budget,"final_date", false)});
    this.addZeroDecimalValue();
    this.util.msjLoading = "Actualizando presupuesto de la cuenta con id_account: " + this.budget.value.id_account + ", categoria con id_category: " + this.budget.value.id_category + " del Respaldo Id_backup: " + this.budgetService.id_backup;
    this.budgetService.actualizarBudget(this.budget.value, this.indexUniqueBudgetSelected). subscribe(result => {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
      this.util.msj = result.msj;
      if (!result.error) {
        if (!result.budget.error) {
          if (this.budgetService.isFilter()) {
            if (this.budgetService.indexBudgetSelected != -1) this.budgetService.Budgets[this.budgetService.indexBudgetSelected] = result.budget.update;
            this.budgetService[this.budgetService.indexBudgetFilterSelected] = result.budget.update;
          } else {
            this.budgetService.Budgets[this.budgetService.indexBudgetSelected] = result.budget.update;
          }
        } else {
          this.util.msjToast(result.budget.msj, this.util.errorRefreshListTable, result.budget.error);
        }
        this.closeModal();
      } else {
        this.budget.patchValue({initial_date: this.util.formatComponentDateCalendar( this.budget.value.initial_date)});
        this.budget.patchValue({final_date: this.util.formatComponentDateCalendar( this.budget.value.final_date)});
      }
    }, error => {
      this.util.msjErrorInterno(error);
    });
  }
  private eliminarBudget() {
    this.util.msjLoading = "Eliminando presupuesto de la cuenta con id_account: " + this.budget.value.id_account + ", categoria con id_category: " + this.budget.value.id_category + " del Respaldo Id_backup: " + this.budgetService.id_backup;
    this.budgetService.eliminarBudget(this.indexUniqueBudgetSelected).subscribe(result => {
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
      this.util.msj = result.msj;
      if (!result.error) {
        if (this.budgetService.isFilter()) {
          if (this.budgetService.indexBudgetSelected != -1) this.budgetService.Budgets.splice(this.budgetService.indexBudgetSelected, 1);
          this.budgetService.budgetsFilter.splice(this.budgetService.indexBudgetFilterSelected, 1);
        } else {
          this.budgetService.Budgets.splice(this.budgetService.indexBudgetSelected, 1);
        }
        this.closeModal();
      }
    }, error => {
      this.util.msjErrorInterno(error);
    });
  }
  private addZeroDecimalValue() {
    this.budget.patchValue({amount: this.util.zeroFile(this.budget.value.amount)});
    this.budget.patchValue({budget: this.util.zeroFile(this.budget.value.budget)});
  }
  private accountSelectedModal(event) {
    this.indexBudgetSelectModal = event.target.selectedIndex;
    this.budget.patchValue({id_category: ''});
    console.log("event:=", event.target.selectedIndex);
    console.log("event:=", this.budget.value.id_account);
    if (this.budget.value.id_account == "" || this.budget.value.id_account == "10001") return;

    this.budgetService.obtCategoriesAccountBackup(this.indexBudgetSelectModal.toString());
  }
}
