import { Component, OnInit } from '@angular/core';
import {AccountsService} from "../../../../../Servicios/accounts/accounts.service";
import {Utilerias} from "../../../../../Utilerias/Util";
import { faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {BackupService} from "../../../../../Servicios/backup/backup.service";


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public msj;
  private pagina: number = 0;
  private faArrowUp = faArrowUp;

  constructor(private backupService: BackupService, private accountService: AccountsService, private util: Utilerias) {
    this.resetearVariables();
    this.buscarInconsistencia();
  }

  ngOnInit() {
    console.log("ngOnInit()");
    this.util.ready();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarInconsistencia();
  }

  private resetearVariables() {
    this.backupService.backups = [];
    this.accountService.Accounts = [];
    this.pagina = 0;
  }

  private buscarInconsistencia() {
    this.util.loading = true;
    if (this.pagina == 0) {
      this.msj = 'Buscando inconsistencia de datos en la tabla Accounts';
      this.util.crearLoading().then(() => {
        this.accountService.buscarInconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.accountService.buscarInconsistenciaDatos(this.util.emailUserMntInconsistencia, this.pagina).subscribe(result => {
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
      this.accountService.Accounts = this.accountService.Accounts.concat(result.accounts);
      this.backupService.backups = result.backupsUser;
    }
    this.util.loading = false;

  }


}
