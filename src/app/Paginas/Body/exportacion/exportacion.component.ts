import {Component, ElementRef, OnInit, Renderer2, ViewChildren} from '@angular/core';
import {Utilerias} from '../../../Utilerias/Util';
import {BackupService} from '../../../Servicios/backup/backup.service';
import {UserService} from '../../../Servicios/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FiltrosSearchBackups} from '../../../Modelos/Backup/filtros-search-backups';
import { URL } from '../../../Utilerias/URL';

@Component({
  selector: 'app-exportacion',
  templateUrl: './exportacion.component.html',
  styleUrls: ['./exportacion.component.css']
})
export class ExportacionComponent implements OnInit {

  public typeEXport: string = "sqlite";
  public email: string = "";
  public option: string = "";

  @ViewChildren("cntBackupsUser") cntBackupsUser = ElementRef;

  constructor(public util:Utilerias, public backupService: BackupService, public userService: UserService, public route: ActivatedRoute,
  public router: Router, public renderer: Renderer2) {
    this.search();
  }

  ngOnInit() {
  }
  public onScroll() {
    this.searchUsers();
  }

  public search() {
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
  public searchUsers() {
    this.util.loadingMain = true;
    if (this.backupService.pagina == 0) {
      this.util.msjLoading = "Buscando usuario" + ((this.util.emailUserExportacionBackups == "Generales") ? "s: " : ": ") + this.util.emailUserExportacionBackups;
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
  public resultado(result) {
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
  public detalleUsuario(index) {
    this.backupService.indexUser = index;
    this.userService.User = this.backupService.userBackups[this.backupService.indexUser];
    //console.log(this.backupService.userBackups[this.backupService.indexUser].backups);
    console.log(this.backupService.userBackups[this.backupService.indexUser].collapsed);
    if (!this.backupService.userBackups[this.backupService.indexUser].collapsed || this.backupService.userBackups[this.backupService.indexUser].collapsed == undefined) {
      this.util.msjLoading = "Cargando backups del usuario: " + this.backupService.userBackups[this.backupService.indexUser].email;
      this.util.crearLoading().then(() => {
        this.backupService.buscarBackupsUserId(this.backupService.userBackups[this.backupService.indexUser].id_user, '-1' ,'asc').subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          this.backupService.userBackups[this.backupService.indexUser].msj = result.msj;
          this.backupService.userBackups[this.backupService.indexUser].cantRep = result.backups.length;
          console.log(result.backups);

          if (!result.error){
            this.backupService.userBackups[this.backupService.indexUser].filtrosSearch = new FiltrosSearchBackups();
            this.backupService.userBackups[this.backupService.indexUser].backupsFiltro = [];
            this.backupService.userBackups[this.backupService.indexUser].backups = result.backups;
            this.router.navigate(['/home/backups/detalleUsuario']);

          }
        }, error =>  {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.router.navigate(['/home/backups/detalleUsuario']);
    }
  }
  public verficarExpansion(indice, idUser, email) {
    if (!this.backupService.userBackups[indice].collapsed) { // Expandir
      this.util.msjLoading = "Cargando backups del usuario: " + email;
      this.util.crearLoading().then(() => {
        this.backupService.buscarBackupsUserId(idUser, '-1' ,'asc').subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          this.backupService.userBackups[indice].msj = result.msj;
          this.backupService.userBackups[indice].cantRep = result.backups.length;
          console.log(result.backups);

          if (!result.error){
            this.backupService.userBackups[indice].filtrosSearch = new FiltrosSearchBackups();
            this.backupService.userBackups[indice].backupsFiltro = [];
            this.backupService.userBackups[indice].backups = result.backups;
            let H = (this.util.obtisFullHDDisplay()) ? 775 : 575;
            this.expandir(H, 13, this.cntBackupsUser['_results'][indice].nativeElement);
            this.backupService.userBackups[indice].collapsed  = true;
            this.backupService.indexUser = indice;
            this.userService.User = this.backupService.userBackups[this.backupService.indexUser];
          }
        }, error =>  {
          this.util.msjErrorInterno(error);
        });
      });
    } else { // Minimizar
      this.minimizar(this.cntBackupsUser['_results'][indice].nativeElement);
      this.backupService.userBackups[indice].collapsed  = false;
      this.backupService.userBackups[indice].backupsFiltro = [];
      this.backupService.userBackups[indice].backups = [];

    }
    // this.backupService.userBackups[indice].collapsed  = !this.backupService.userBackups[indice].collapsed;
    console.log(this.backupService.userBackups[indice].collapsed );
    console.log(this.cntBackupsUser['_results']);
  }
  public minimizar(content: any) {
    console.log(content);
    this.renderer.setStyle(content, "transition", "height 500ms, max-height 500ms, padding 500ms");
    this.renderer.setStyle(content, "height", "0px");
    this.renderer.setStyle(content, "max-height", "0px");
    this.renderer.setStyle(content, "padding", "0px 16px");
    // this.renderer.setStyle(content, "overflow", "hidden");
  }
  public expandir(H, P, content) {
    console.log(content);
    this.renderer.setStyle(content, "transition", "height 500ms, max-height 500ms, padding 500ms");
    this.renderer.setStyle(content, "height", H + "px");
    this.renderer.setStyle(content, "max-height", H + "px");
    this.renderer.setStyle(content, "padding", P + "px 16px");
  }
  public accionExportar(option, id_backup, indexUser) {
    this.typeEXport = "sqlite";
    this.option = option;
    this.backupService.indexUser = indexUser;
    this.backupService.userBackups[this.backupService.indexUser].id_BackupSelected = id_backup;

  }
  public exportBackup() {
    console.log("Value typeExport Backup:=", this.typeEXport);
    this.util.msjLoading = "Exportando Respaldo con id_backup: " + this.backupService.userBackups[this.backupService.indexUser].id_BackupSelected + " como fichero " + this.typeEXport;
    this.util.crearLoading().then(() => {
      this.backupService.exportBackup(this.typeEXport, this.backupService.userBackups[this.backupService.indexUser].id_BackupSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (result.error == "warning") {
          for (let error of result.errorInsert){
            this.util.msjToast(error.msj, error.titulo, error.error);
          }
        } else {
          if (this.typeEXport == "sqlite") {
            window.open( URL + 'exports/database.sqlite', '_blank');
          } else {
            window.open( URL + 'exports/Reporte.xlsx', '_blank');
          }
        }
        console.log("Value Result:= ", result);
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
}
