import {Component, ElementRef, OnInit, ViewChildren, Renderer2} from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {BackupService} from "../../../../Servicios/backup/backup.service";
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {CampoNumerico} from '../../../../Utilerias/validacionCampoNumerico';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {
  private email: string = "";
  private rangoBackups: number = 10;
  private pagina: number = 0;
  private beforeRangoBackups: number;
  private msj = "";
  public faArrowCircleDown = faArrowDown;
  public faArrowCircleUp = faArrowUp;
  @ViewChildren("cntBackupsUser") cntBackupsUser = ElementRef;

  constructor(private util: Utilerias, private backupService: BackupService, private renderer: Renderer2) {
    this.resetearVariables();
    this.buscarBackups();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscarBackups();
  }
  ngOnInit() {
    new CampoNumerico("#rangoBackups");
    this.util.ready();
  }
  private resetearVariables() {
    this.pagina = 0;
    this.backupService.mntBackups = [];
  }
  public search() {
    this.resetearVariables();
    console.log("email user:", this.email);
    if (this.email.length == 0) {
      this.util.emailUserMntBackup = "Generales";
      this.buscarBackups();
    } else {
      if ((this.util.regex_email).exec(this.email)) {
        this.util.emailUserMntBackup = this.email;
        console.log("this.util.emailUserMntBackup ", this.util.emailUserMntBackup );
        this.buscarBackups();
      } else {
        this.util.msjToast("Porfavor ingrese un correo valido", "Email no Valido", true);
      }
    }
  }
  private buscarBackups() {
    if (this.pagina == 0) {
      this.msj = "Buscando backups " + ((this.util.emailUserMntBackup == "Generales") ? this.util.emailUserMntBackup: "del usuario : " + this.util.emailUserMntBackup);
      this.util.crearLoading().then(() => {
        this.backupService.buscarBackupsUserCantidad(this.util.emailUserMntBackup, this.rangoBackups, this.pagina).subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.backupService.buscarBackupsUserCantidad(this.util.emailUserMntBackup, this.rangoBackups, this.pagina).subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result, bnd = true) {
    if (bnd){
      this.util.detenerLoading();
      this.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.backupService.mntBackups = this.backupService.mntBackups.concat(result.backups);
      //let nuevoBack = this.backupService.mntBackups.concat(result.backups);
      console.log("this.backupService.mntBackups", this.backupService.mntBackups);
    }
    // console.log(result);
  }

  public verficarExpansion(indice, idUser, email) {
    if (this.backupService.mntBackups[indice].collapsed == 0) { // Expandir
      this.msj = "Cargando backups del usuario: " + email;
      this.util.crearLoading().then(() => {
        this.backupService.buscarBackups(idUser, '-1' ,'asc').subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          this.backupService.mntBackups[indice].msj = result.msj;
          this.backupService.mntBackups[indice].cantRep = result.backups.length;
          console.log(result.backups);

          if (!result.error){
            this.backupService.mntBackups[indice].backups = result.backups;
            this.expandir(500, 13, this.cntBackupsUser['_results'][indice].nativeElement);
            this.backupService.mntBackups[indice].collapsed  = 1;
          }
        }, error =>  {
          this.util.msjErrorInterno(error);
        });
      });
    } else { // Minimizar
      this.minimizar(this.cntBackupsUser['_results'][indice].nativeElement);
      this.backupService.mntBackups[indice].collapsed  = 0;
    }
    console.log(this.backupService.mntBackups[indice].collapsed );
    console.log(this.cntBackupsUser['_results']);
  }
  private minimizar(content: any) {
    console.log(content);
    this.renderer.setStyle(content, "transition", "height 500ms, max-height 500ms, padding 500ms");
    this.renderer.setStyle(content, "height", "0px");
    this.renderer.setStyle(content, "max-height", "0px");
    this.renderer.setStyle(content, "padding", "0px 16px");
    this.renderer.setStyle(content, "overflow", "hidden");
  }
  private expandir(H, P, content) {
    console.log(content);
    this.renderer.setStyle(content, "transition", "height 500ms, max-height 500ms, padding 500ms");
    this.renderer.setStyle(content, "height", H + "px");
    this.renderer.setStyle(content, "max-height", H + "px");
    this.renderer.setStyle(content, "padding", P + "px 16px");
  }
  public encabezado(i){
    return "#" + i;
  }
  public eliminar(indice, numBack, idBack) {
    console.log(this.backupService.mntBackups[indice]);
    let opcion = confirm("Esta seguro de eliminar el Respaldo num: " + (numBack + 1) + ", Backup: " + idBack + "?");
    if (opcion) {
      // On Delete On Cascada.
      this.util.crearLoading().then(()=> {
        this.backupService.eliminarBackup(idBack).subscribe(
          result => {
            this.util.detenerLoading();
            this.util.msjToast(result.msj, result.titulo, result.error);
            if (!result.error) {
              // Backuo Eliminado correctamente.
              this.backupService.mntBackups[indice].backups.splice(numBack,1);
              // this.backupService.backups.splice(numBack,1);
            }
            console.log(result);
          },
          error => {
            this.util.msjErrorInterno(error);
          });
      });
    }
    console.log('Opcion Elegida', opcion);
  }

  public limpiarBackups(idUser, email, cantidad, pos = 0) {
    let Quien = (idUser == 0) ? "de todos los usuarios " + email : "del usuario : " + email;
    let opcion = confirm("¿ Estas seguro de limpiar los backups " + Quien + " ?");
    if (opcion) {
      this.msj = "Limpiando backups " + Quien;
      this.util.crearLoading().then(() => {
        this.backupService.limpiarBackups(idUser, email, this.rangoBackups, cantidad).subscribe(result => {
          this.util.detenerLoading();
          if (!result.error) {
            if (idUser != 0) { // Un solo usuario
              this.backupService.mntBackups.splice(pos, 1);
            } else { // General
              this.backupService.mntBackups = [];
            }
            this.util.msjToast(result.msj, result.titulo, result.error);
            this.msj = result.msj;
          } else  {
            if (idUser == 0) {
              this.util.msjErrorInterno(result.msj, result.titulo);
              for (let errorUSer of result.errorUser) {
                this.util.msjToast(errorUSer.msj, errorUSer.titulo, errorUSer.error);
              }
            } else {
              this.util.msjToast(result.msj, result.titulo, result.error);
            }
          }
          console.log(result);
        },error => {
          this.util.msjErrorInterno(error);
        });
      });
    }
    console.log(opcion);
  }
  afterBlur(event) {
    // console.log("event Rango", event.target.value);
    // console.log("This.Rango", this.rangoBackups);
    if (this.beforeRangoBackups != this.rangoBackups) {
      console.log('Adelante se tiene que hacer una consulta nueva.');
      this.resetearVariables();
      this.buscarBackups();

    } else {
      console.log("Ohh nada");
    }
  }
  beforeBlur(event) {
    // console.log("beforeBlur", event.target.value);
    this.beforeRangoBackups = event.target.value;
  }
}
