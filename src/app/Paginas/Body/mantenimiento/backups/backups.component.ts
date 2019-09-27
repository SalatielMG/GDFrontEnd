import {Component, ElementRef, OnInit, ViewChildren, Renderer2} from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {BackupService} from "../../../../Servicios/backup/backup.service";
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {CampoNumerico} from '../../../../Utilerias/validacionCampoNumerico';
import {Backup} from "../../../../Modelos/Backup/backup";
import {UserSelect} from "./userSelect";
import {forEachComment} from "tslint";
import {tryCatch} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {
  private email: string = "";
  private rangoBackups = {
    value : 10,
    beforeValue: 0,
  };
  private rangoUsers = {
    value : 5,
    beforeValue: 0,
  };
  private usersSelected : UserSelect[];
  private pagina: number = 0;
  private msj = "";
  public faArrowCircleDown = faArrowDown;
  public faArrowCircleUp = faArrowUp;

  @ViewChildren("cntBackupsUser") cntBackupsUser = ElementRef;

  constructor(private util: Utilerias, private backupService: BackupService, private renderer: Renderer2) {
    this.usersSelected = [];
    this.resetearVariables();
    this.buscarBackups();
  }

  private onScroll () {
    console.log('scrolled!!');
    this.buscarBackups();
  }
  ngOnInit() {
    new CampoNumerico("#rangoUsers");
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
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.msj = "Buscando backups " + ((this.util.emailUserMntBackup == "Generales") ? this.util.emailUserMntBackup: "del usuario : " + this.util.emailUserMntBackup);
      this.util.crearLoading().then(() => {
        this.backupService.buscarBackupsUserMnt(this.util.emailUserMntBackup, this.rangoBackups.value, this.pagina).subscribe(result => {
          this.resultado(result);
          this.collapseSelected();
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.backupService.buscarBackupsUserMnt(this.util.emailUserMntBackup, this.rangoBackups.value, this.pagina).subscribe(result => {
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
    this.util.loadingMain = false;
    // console.log(result);
  }

  public verficarExpansion(indice, idUser, email) {
    if (this.backupService.mntBackups[indice].collapsed == 0) { // Expandir
      this.msj = "Cargando backups del usuario: " + email;
      this.util.crearLoading().then(() => {
        this.backupService.buscarBackupsUserId(idUser, '-1' ,'asc').subscribe(result => {
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
    // this.renderer.setStyle(content, "overflow", "hidden");
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
        this.backupService.limpiarBackups(idUser, email, this.rangoBackups.value, cantidad).subscribe(result => {
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
              this.util.msjErrorInterno(result.msj, true, true, result.titulo);
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


  private eventSelectCollapse(index){
    console.log("After Event Collapse Activated:= ", this.backupService.mntBackups[index]);
    console.log("this.backupService.mntBackups[index].checked ", this.backupService.mntBackups[index].checked);
    if (!this.backupService.mntBackups[index].checked || this.backupService.mntBackups[index].checked == undefined) { //Checked => push userSelected
      let user = new UserSelect(this.backupService.mntBackups[index].id_user, index);
      this.usersSelected.push(user);
      console.log("Agregado user.index:=", index);
    } else { //No Checked => splice userSelected
      this.usersSelected.forEach((userU, indexU) => {
        if (userU.index == index) {
          this.usersSelected.splice(indexU, 1);
          console.log("Elimnado user.index:=", index);
        }
      });
    }
    this.rangoUsers.value = this.usersSelected.length;
    this.rangoUsers.beforeValue = this.usersSelected.length;
    this.backupService.mntBackups[index].checked = !this.backupService.mntBackups[index].checked;
    console.log("Before Event Collapse Activated:= ", this.backupService.mntBackups[index]);
    console.log("this.usersSelected", this.usersSelected);
  }
  private collapseSelected() {
    this.usersSelected = [];
    this.rangoUsers.value = 10;
    this.rangoUsers.beforeValue = 10;
    console.log("this.rangoUsers.value", this.rangoUsers.value);
    if (this.backupService.mntBackups.length >= this.rangoUsers.value) {
      for (let i = 0; i < this.rangoUsers.value; i++) {
        this.backupService.mntBackups[i].checked = true;
        console.log("this.backupService.mntBackups[" + i + "].checked", this.backupService.mntBackups[i].checked);
        let user = new UserSelect(this.backupService.mntBackups[i].id_user, i);
        this.usersSelected.push(user);
      }
    } else {
      for (let user of this.backupService.mntBackups) {
        user.checked = true;
      }
    }
    console.log("this.usersSelected", this.usersSelected);
  }
  private afterBlur(event) {
    if (this.rangoBackups.beforeValue != this.rangoBackups.value) {
      this.resetearVariables();
      this.buscarBackups();

    }
  }
  private beforeBlur(event) {
    this.rangoBackups.beforeValue = this.rangoBackups.value;
  }
  private keyUpEvent(event){
    if (event.key == "Enter") {
      console.log("this.rangoBackups.value", this.rangoBackups.value);
      console.log("this.rangoBackups.beforeValue", this.rangoBackups.beforeValue);
      this.afterBlur(event);
      this.beforeBlur(event);
    }
  }
  private keyUpEventRangoUsers(event) {
    if (event.key == "Enter") {
      this.afterBlurRangoUsers(event);
      this.beforeBlurRangoUsers(event);
    }
  }
  private afterBlurRangoUsers(event) {// Evento filtroSeleccionar
    console.log("this.rangoUsers", this.rangoUsers);
    if (this.rangoUsers.value > this.rangoUsers.beforeValue) { //Selecionar usuarios faatantes
      let faltantes = this.rangoUsers.value - this.rangoUsers.beforeValue;
      console.log("Usuarios faltantes", faltantes);

      this.backupService.mntBackups.forEach((back, index) => {
        if (faltantes == 0) return;
        if (!back.checked || back.checked == undefined) {
          this.backupService.mntBackups[index].checked = true;
          let user = new UserSelect(back.id_user, index);
          this.usersSelected.push(user);
          faltantes -= 1;
        }
        console.log("encontrado faltantes", faltantes);
      });
    } else { //Deseleccionar usuarios restantes.

    }
  }
  private beforeBlurRangoUsers(event) {
    this.rangoUsers.beforeValue = this.rangoUsers.value;
  }
}
