import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../Utilerias/Util';
import {BackupService} from '../../../Servicios/backup/backup.service';
import {UserService} from '../../../Servicios/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-exportacion',
  templateUrl: './exportacion.component.html',
  styleUrls: ['./exportacion.component.css']
})
export class ExportacionComponent implements OnInit {

  private email: string = "";

  constructor(private util:Utilerias, private backupService: BackupService, private userService: UserService, private route: ActivatedRoute,
  private router: Router) {
    this.search();
  }

  ngOnInit() {
  }
  private onScroll() {
    this.searchUsers();
  }

  private search() {
    this.backupService.resetearBackups();
    if (this.email.length == 0) {
      this.util.emailUserExportacionBackups = "Generales";
      this.searchUsers();
    } else {
      if ((this.util.regex_email).exec(this.email)) {
        this.util.emailUserExportacionBackups = this.email;
        this.searchUsers();
      } else {
        this.util.msjToast(this.util.errorMsjEmailNoValido, this.util.errorTituloEmailNoValido, true);
      }
    }
  }
  private searchUsers() {
    this.util.loadingMain = true;
    if (this.backupService.pagina == 0) {
      this.util.msjLoading = "Buscando Usuario" + ((this.util.emailUserExportacionBackups == "Generales") ? "s: " : ": ") + this.util.emailUserExportacionBackups;
      this.util.crearLoading().then(() => {
        this.backupService.buscarUsersExportacionBackups(this.util.emailUserExportacionBackups).subscribe(result => {
          this.resultado(result)
        }, error => {
          this.util.msjErrorInterno(error, false);
        });
      });
    } else {
      this.backupService.buscarUsersExportacionBackups(this.util.emailUserExportacionBackups).subscribe(result => {
        this.resultado(result)
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result) {
    if (this.backupService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      this.backupService.pagina += 1;
      this.backupService.userBackups = this.backupService.userBackups.concat(result.users);
    } else {
      this.util.QueryComplete.isComplete = this.backupService.pagina != 0;
    }
    this.util.loadingMain = false;
  }

}
