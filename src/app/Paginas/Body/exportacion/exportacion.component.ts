import {Component, ElementRef, OnInit, Renderer2, ViewChildren} from '@angular/core';
import {Utilerias} from '../../../Utilerias/Util';
import {BackupService} from '../../../Servicios/backup/backup.service';
import {UserService} from '../../../Servicios/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FiltrosSearchBackups} from '../../../Modelos/Backup/filtros-search-backups';

@Component({
  selector: 'app-exportacion',
  templateUrl: './exportacion.component.html',
  styleUrls: ['./exportacion.component.css']
})
export class ExportacionComponent implements OnInit {

  private typeEXport: string = "sqlite";
  private email: string = "";
  private option: string = "";

  @ViewChildren("cntBackupsUser") cntBackupsUser = ElementRef;

  constructor(private util:Utilerias, private backupService: BackupService, private userService: UserService, private route: ActivatedRoute,
  private router: Router, private renderer: Renderer2) {
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
            this.router.navigate(['/detalleUsuario']);

          }
        }, error =>  {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.router.navigate(['/detalleUsuario']);
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
            this.expandir(575, 13, this.cntBackupsUser['_results'][indice].nativeElement);
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
  private minimizar(content: any) {
    console.log(content);
    this.renderer.setStyle(content, "transition", "height 500ms, max-height 500ms, padding 500ms");
    this.renderer.setStyle(content, "height", "0px");
    this.renderer.setStyle(content, "max-height", "0px");
    this.renderer.setStyle(content, "padding", "0px 16px");
    // this.renderer.setStyle(content, "overflow", "hidden");
  }
  private expandir(H, P, content) {
    console.log(content);
    this.renderer.setStyle(content, "transition", "height 500ms, max-height 500ms, padding 500ms");
    this.renderer.setStyle(content, "height", H + "px");
    this.renderer.setStyle(content, "max-height", H + "px");
    this.renderer.setStyle(content, "padding", P + "px 16px");
  }
  private accionExportar(option, id_backup, indexUser) {
    this.typeEXport = "sqlite";
    this.option = option;
    this.backupService.indexUser = indexUser;
    this.backupService.userBackups[this.backupService.indexUser].id_BackupSelected = id_backup;

  }
  private exportBackup() {
    console.log("Value typeExport Backup:=", this.typeEXport);
    this.util.msjLoading = "Exportando Base de datos";
    this.util.crearLoading().then(() => {
      this.backupService.exportBackup(this.typeEXport, this.backupService.userBackups[this.backupService.indexUser].id_BackupSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        console.log("Value Result:= ", result);
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
}
