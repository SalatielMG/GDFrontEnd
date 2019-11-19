import { Component } from '@angular/core';
import {AccountsService} from "../../../../../Servicios/accounts/accounts.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import {ActivatedRoute, Router} from "@angular/router";
import {Accounts} from '../../../../../Modelos/accounts/accounts';
import {UsuarioService} from '../../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent {

  public accountSeleced: Accounts = new Accounts();
  public backups;

  constructor(public route: ActivatedRoute,
              public router: Router, public accountService: AccountsService, public util: Utilerias, private usuarioService: UsuarioService) {
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
    if (!this.util.loadingMain) this.buscarInconsistencia();
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
        this.util.QueryComplete.isComplete = result.accounts.length < this.util.limit_Inconsistencia;
      }
      this.accountService.pagina += 1;
      this.accountService.Accounts = this.accountService.Accounts.concat(result.accounts);
    } else {
      this.util.QueryComplete.isComplete = true;
    }
    this.util.loadingMain = false;
  }

  public accionCorreirRegistro(account: Accounts, index) {
    this.accountService.indexAccountSelected = index;
    this.accountSeleced = account;
    this.util.abrirModal("#modalAccount");
  }
  public corregirInconsistenciaRegistro() {
    let account: any = {};
    account["id_backup"] = this.accountSeleced.id_backup;
    account["id_account"] = this.accountSeleced.id_account;
    account["name"] = this.accountSeleced.name;
    this.util.msjLoading = "Corrigiendo inconsistencias del registro Account con " + this.util.key_Names(account);
    this.util.crearLoading().then(() => {
      this.accountService.corregirInconsistenciaRegistro(account, this.usuarioService.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.account.error) {
            this.accountService.Accounts[this.accountService.indexAccountSelected] = result.account.accounts[0];
          } else {
            this.accountService.Accounts[this.accountService.indexAccountSelected]["repeated"] = 1;
          }
          this.util.cerrarModal("#modalAccount");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

}
