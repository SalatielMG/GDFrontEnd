import { Component } from '@angular/core';
import {AccountsService} from "../../../../../Servicios/accounts/accounts.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent {

  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public accountService: AccountsService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.accountService.resetearVariables();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Accounts";
        return;
      }
      this.buscarInconsistencia();
    });

  }

  public onScroll() {
    if (!this.accountService.isFilter() && !this.util.loadingMain) this.buscarInconsistencia();
  }

  public buscarInconsistencia() {
    this.util.loadingMain = true;
    if (this.accountService.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Accounts';
      this.util.crearLoading().then(() => {
        this.accountService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.accountService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.backups).subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }

  }

  public resultado(result) {
    this.util.msj = result.msj;
    if (this.accountService.pagina == 0) { // Primera Busqueda
      this.util.detenerLoading();
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      if (this.accountService.pagina == 0) {
        this.util.QueryComplete.isComplete = result.accounts.length < this.util.limit;
      }
      this.accountService.pagina += 1;
      this.accountService.Accounts = this.accountService.Accounts.concat(result.accounts);
    } else {
      this.util.QueryComplete.isComplete = this.accountService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

}
