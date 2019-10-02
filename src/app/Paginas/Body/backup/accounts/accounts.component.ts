import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../../../Servicios/accounts/accounts.service';
import { Utilerias } from '../../../../Utilerias/Util';
import {Accounts} from "../../../../Modelos/accounts/accounts";
import {FiltersSearchAccounts} from "../../../../Modelos/accounts/filters-search-accounts";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public msj;
  private pagina: number = 0;
  private id_backup;
  private filtersSearch = new FiltersSearchAccounts();
  private accountsFilter: Accounts[];

  constructor( private route: ActivatedRoute,
               private router: Router, private accountService: AccountsService, private util: Utilerias) {
    this.route.parent.paramMap.subscribe(params => {
      this.id_backup = params.get("idBack");
      this.resetearVariables();
      this.buscarAccounts();
    });
  }
  private onScroll() {
    if (!this.isFilter()) this.buscarAccounts();
  }
  private resetearVariables() {
    this.accountService.Accounts = [];
    this.pagina = 0;
  }
  private buscarAccounts() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = "Buscando registros en la tabla Accounts del backup : " + this.id_backup;
      this.util.crearLoading().then(() => {
        this.accountService.buscarAccountsBackup(this.id_backup, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.accountService.buscarAccountsBackup(this.id_backup, this.pagina).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result) {
    if (this.pagina == 0) { // Primera Busqueda
      this.util.detenerLoading();
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.accountService.Accounts = this.accountService.Accounts.concat(result.accounts);
      this.util.QueryComplete.isComplete = false;
      // console.log("Accounts", this.accountService.Accounts);
    } else {
      this.util.QueryComplete.isComplete = this.pagina != 0;
    }
    this.util.loadingMain = false;
  }

  ngOnInit() {
  }

  // -------------------------------------------------- Filter Seacrh --------------------------------------------------
  private actionFilterEvent(event, value, isKeyUp = false) {
    if (value == "selected") {
      if (this.filtersSearch[value].value == "-1") {
        this.filtersSearch[value].isFilter = false;
        this.filtersSearch[value].valueAnt = this.filtersSearch[value].value;
        this.proccessFilter();
        return;
      }
    } else {
      if (isKeyUp && event.key != "Enter") return;
      if (this.filtersSearch[value].value == "") return;
    }
    if (this.filtersSearch[value].value == this.filtersSearch[value].valueAnt) return;
    this.resetFilterisActive();
    this.filtersSearch[value].isFilter = true;
    this.filtersSearch[value].valueAnt = this.filtersSearch[value].value;
    this.proccessFilter();
  }
  private resetValuefiltroSearch(key) {
    this.filtersSearch[key].value =  "";
    this.filtersSearch[key].valueAnt =  "";
    this.filtersSearch[key].isFilter =  false;
    if (key == "selected") this.filtersSearch[key].value = "-1";

    if (!this.isFilter()) {
      this.accountsFilter = [];
      return;
    }
    this.proccessFilter();
  }
  private resetFilterisActive() {
    if (!this.isFilter()) {
      this.accountsFilter = [];
      this.accountsFilter =  this.accountsFilter.concat(this.accountService.Accounts);
    }
  }
  private proccessFilter() {
    let temp = [];
    this.accountService.Accounts.forEach((account) => {

      let bnd = true;
      for (let k in this.filtersSearch) {
        if (this.filtersSearch[k].isFilter) {
          if (k == "selected" && this.filtersSearch[k].value != "-1") {
            if (account[k].toString() != this.filtersSearch[k].value) {
              bnd = false;
              break;
            }
          } else {
            if (!account[k].toString().includes(this.filtersSearch[k].value)) {
              bnd = false;
              break;
            }
          }
        }
      }

      if (bnd) {
        temp.push(account);
      }

    });
    this.accountsFilter = [];
    this.accountsFilter = this.accountsFilter.concat(temp);
    temp = null;
  }
  private isFilter(): boolean {
    for (let key in this.filtersSearch)
      if (this.filtersSearch[key].isFilter) return true;
    return false
  }
  // -------------------------------------------------- Filter Seacrh --------------------------------------------------

}
