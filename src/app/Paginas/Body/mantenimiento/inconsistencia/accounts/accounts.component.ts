import { Component, OnInit } from '@angular/core';
import {AccountsService} from "../../../../../Servicios/accounts/accounts.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public pagina: number = 0;
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public accountService: AccountsService, public util: Utilerias) {
    this.route.paramMap.subscribe((params) => {
      this.backups = params.get("backups");
      this.resetearVariables();
      let backs = JSON.parse(this.backups);
      if (backs.length == 0) {
        this.util.msj = "Porfavor filtre los backups a buscar en la tabla Accounts";
        return;
      }
      this.buscarInconsistencia();
    });

  }

  ngOnInit() {
    console.log("ngOnInit()");
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }

  public resetearVariables() {

    this.accountService.Accounts = [];
    this.pagina = 0;
  }

  public buscarInconsistencia() {
    this.util.loadingMain = true;
    console.log("dataUserMntincosnistencia", this.util.userMntInconsistencia);
    if (this.pagina == 0) {
      this.util.msjLoading = 'Buscando inconsistencia de datos en la tabla Accounts';
      this.util.crearLoading().then(() => {
        this.accountService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.accountService.buscarInconsistenciaDatos(this.util.userMntInconsistencia, this.pagina, this.backups).subscribe(result => {
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
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.accountService.Accounts = this.accountService.Accounts.concat(result.accounts);
    }
    this.util.loadingMain = false;
  }

}
