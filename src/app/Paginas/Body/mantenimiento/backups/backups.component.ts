import { Component, ElementRef, OnInit, ViewChildren, Renderer2 } from '@angular/core';
import { Utilerias } from '../../../../Utilerias/Util';
import { BackupService } from "../../../../Servicios/backup/backup.service";
import { CampoNumerico } from '../../../../Utilerias/validacionCampoNumerico';
import { UserSelect } from "./userSelect";
import {Backup} from '../../../../Modelos/Backup/backup';
import {FiltrosSearchBackups} from '../../../../Modelos/Backup/filtros-search-backups';
import {UserService} from '../../../../Servicios/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {

  private option: string = "";
  private email: string = "";
  private rangoBackups = {
    value : 10,
    beforeValue: 0,
  };
  private rangoUsers = {
    value : 5,
    beforeValue: 0,
  };
  private users: UserSelect[] = [];
  private usersSelected : UserSelect[];
  private msj = "";

  @ViewChildren("cntBackupsUser") cntBackupsUser = ElementRef;

  constructor(private util: Utilerias, private backupService: BackupService, private renderer: Renderer2, private userService: UserService, private route: ActivatedRoute,
  private router: Router) {
    this.usersSelected = [];
    this.backupService.resetearBackups();
    this.buscarBackupsUserMnt();
  }

  private onScroll () {
    console.log('scrolled!!');
    this.buscarBackupsUserMnt();
  }
  ngOnInit() {
    new CampoNumerico("#rangoUsers");
    new CampoNumerico("#rangoBackups");
    this.util.ready();
  }
  public search() {
    this.backupService.resetearBackups();
    console.log("email user:", this.email);
    if (this.email.length == 0) {
      this.util.emailUserMntBackup = "Generales";
      this.buscarBackupsUserMnt();
    } else {
      if ((this.util.regex_email).exec(this.email)) {
        this.util.emailUserMntBackup = this.email;
        console.log("this.util.emailUserMntBackup ", this.util.emailUserMntBackup );
        this.buscarBackupsUserMnt();
      } else {
        this.util.msjToast("Porfavor ingrese un correo valido", "Email no Valido", true);
      }
    }
  }
  private buscarBackupsUserMnt() {
    this.util.loadingMain = true;
    if (this.backupService.pagina == 0) {
      this.msj = "Buscando backups " + ((this.util.emailUserMntBackup == "Generales") ? this.util.emailUserMntBackup: "del usuario : " + this.util.emailUserMntBackup);
      this.util.crearLoading().then(() => {
        this.backupService.buscarBackupsUserMnt(this.util.emailUserMntBackup, this.rangoBackups.value).subscribe(result => {
          this.resultado(result);
          this.collapseSelected();
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.backupService.buscarBackupsUserMnt(this.util.emailUserMntBackup, this.rangoBackups.value).subscribe(result => {
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
      this.util.QueryComplete.isComplete = false;
      this.backupService.pagina += 1;
      this.backupService.userBackups = this.backupService.userBackups.concat(result.backups);
      //let nuevoBack = this.backupService.userBackups.concat(result.backups);
      console.log("this.backupService.userBackups", this.backupService.userBackups);
    } else {
      if (this.backupService.pagina == 0) {
        this.util.QueryComplete.isComplete = false;
      } else {
        this.util.QueryComplete.isComplete = true;
      }
    }
    this.util.loadingMain = false;
    // console.log(result);
  }

  public verficarExpansion(indice, idUser, email) {
    if (!this.backupService.userBackups[indice].collapsed) { // Expandir
      this.msj = "Cargando backups del usuario: " + email;
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
  public encabezado(i){
    return "#" + i;
  }
  public accionEliminar(option, backup: Backup, userIndex, backupIndex) {
    this.option = option;
    this.backupService.indexUser = userIndex;
    this.backupService.userBackups[this.backupService.indexUser].id_BackupSelected = backup.id_backup;
    this.backupService.userBackups[this.backupService.indexUser].indexBackupSelected = backupIndex;
    if (this.backupService.isFilter(this.backupService.indexUser)) {
      this.backupService.userBackups[this.backupService.indexUser].indexBackupSelected = <number> this.backupService.userBackups[this.backupService.indexUser].backups.indexOf(backup);
      this.backupService.userBackups[this.backupService.indexUser].indexBackupFilterSelected = backupIndex;
    }
  }
  public accionLimpiarBackupsUser(option, userSpecified =  null, i = 0) {
    this.option = option;
    this.users = [];
    if (this.option == this.util.LIMPIARBACKUPSUSERS) {
      this.users = this.users.concat(this.usersSelected);
    } else {
      let user = new UserSelect(userSpecified.indexUser, userSpecified.email, userSpecified.cantRep, i);
      this.users.push(user);
    }
    if (this.users.length == 0) {
      this.util.msjToast("Porfavor selecione a los usuarios a limpiar", "", true);
      return;
    } else {
      this.util.abrirModal("#modalBackupsUserMnt");
    }
  }

  public operation() {
    console.log(this.option);

    switch (this.option) {
      case this.util.ELIMINAR:
        this.eliminarBackup();
        break;
      default:
        this.limpiarBackupsUser();
        break
    }
  }
  public eliminarBackup() {
    this.util.msjLoading = "Eliminando Respaldo con id_backup: " + this.backupService.userBackups[this.backupService.indexUser].id_BackupSelected + " del Usuario con email: " + this.backupService.userBackups[this.backupService.indexUser].email;
    this.util.crearLoading().then(()=> {
      this.backupService.eliminarBackup().subscribe(
        result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          this.backupService.userBackups[this.backupService.indexUser].msj = result.msj;
          if (!result.error) {
            if (this.backupService.isFilter(this.backupService.indexUser)) {
              if (this.backupService.userBackups[this.backupService.indexUser].indexBackupSelected != -1) this.backupService.userBackups[this.backupService.indexUser].backups.splice(this.backupService.userBackups[this.backupService.indexUser].indexBackupSelected, 1);

              this.backupService.userBackups[this.backupService.indexUser].backupsFiltro.splice(this.backupService.userBackups[this.backupService.indexUser].indexBackupFilterSelected, 1);
            } else {
              this.backupService.userBackups[this.backupService.indexUser].backups.splice(this.backupService.userBackups[this.backupService.indexUser].indexBackupSelected, 1);
            }
            this.util.cerrarModal("#modalBackupsUserMnt");
            this.option = "";
          }
          console.log(result);
        },
        error => {
          this.util.msjErrorInterno(error);
        });
    });
  }

  private limpiarBackupsUser() {
    let Quien = "";
    for (let user of this.users)
      Quien = Quien + user.email + ", \n";

    this.msj = "Limpiando backups :\n" + Quien;
    this.util.crearLoading().then(() => {
      this.backupService.limpiarBackupsUsers(this.users, this.rangoBackups.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);

        for (let resultUser of result.resultCleanBackupsUser) {
          this.util.msjToast(resultUser.msj, "", resultUser.error);
          console.log("resultUser:=", resultUser);
        }
        if (this.option == this.util.LIMPIARBACKUPSUSERS) {
          this.search();
        } else {
          this.backupService.userBackups.splice(this.users[0].index, 1);
          this.usersSelected.forEach((user, index) => {
            if (user.index == this.users[0].index) {
              this.usersSelected.splice(index, 1);
              this.rangoUsers.value = this.usersSelected.length;
              this.rangoUsers.beforeValue = this.usersSelected.length;
            }
          });
        }
        if (!result.error) {
          this.users = [];
          this.util.cerrarModal("#modalBackupsUserMnt");
          this.option = "";

        } else {
          this.users = result.usuariosError;
        }
      }, error => {
        this.util.msjErrorInterno(error);
        // this.users = [];
      });
    });
  }

  private eventSelectCollapse(index){
    console.log("After Event Collapse Activated:= ", this.backupService.userBackups[index]);
    console.log("this.backupService.userBackups[index].checked ", this.backupService.userBackups[index].checked);
    if (!this.backupService.userBackups[index].checked || this.backupService.userBackups[index].checked == undefined) { //Checked => push userSelected
      let user = new UserSelect(this.backupService.userBackups[index].id_user, this.backupService.userBackups[index]["email"], this.backupService.userBackups[index]["cantRep"], index);
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
    this.backupService.userBackups[index].checked = !this.backupService.userBackups[index].checked;
    console.log("Before Event Collapse Activated:= ", this.backupService.userBackups[index]);
    console.log("this.usersSelected", this.usersSelected);
  }
  private collapseSelected() {
    this.usersSelected = [];
    this.rangoUsers.value = 10;
    this.rangoUsers.beforeValue = 10;
    console.log("this.rangoUsers.value", this.rangoUsers.value);
    if (this.backupService.userBackups.length >= this.rangoUsers.value) {
      for (let i = 0; i < this.rangoUsers.value; i++) {
        this.backupService.userBackups[i].checked = true;
        console.log("this.backupService.userBackups[" + i + "].checked", this.backupService.userBackups[i].checked);
        let user = new UserSelect(this.backupService.userBackups[i].id_user, this.backupService.userBackups[i]["email"], this.backupService.userBackups[i]["cantRep"], i);
        this.usersSelected.push(user);
      }
    } else {
      this.usersSelected = [];
      this.backupService.userBackups.forEach((back, index) => {
        let user = new UserSelect(back.id_user, back["email"], back["cantRep"], index);
        this.usersSelected.push(user);
        back.checked = true;
      });
      this.rangoUsers.value = this.usersSelected.length;
      this.rangoUsers.beforeValue = this.usersSelected.length;
    }
    console.log("this.usersSelected", this.usersSelected);
  }
  private afterBlur(event) {
    if (this.rangoBackups.beforeValue != this.rangoBackups.value) {
      this.backupService.resetearBackups();
      this.buscarBackupsUserMnt();

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
      this.afterBlurRangoUsers();
      this.beforeBlurRangoUsers();
    }
  }
  private afterBlurRangoUsers() {// Evento filtroSeleccionar
    console.log("this.rangoUsers", this.rangoUsers);
    if (this.rangoUsers.value > this.rangoUsers.beforeValue) { //Selecionar usuarios faatantes
      let faltantes = this.rangoUsers.value - this.rangoUsers.beforeValue;
      console.log("Usuarios faltantes", faltantes);

      this.backupService.userBackups.forEach((back, index) => {
        if (faltantes == 0) return;
        if (!back.checked || back.checked == undefined) {
          this.backupService.userBackups[index].checked = true;
          let user = new UserSelect(back.id_user, back["email"], back["cantRep"], index);
          this.usersSelected.push(user);
          faltantes -= 1;
        }
        console.log("encontrado faltantes", faltantes);
      });
    } else { //Deseleccionar usuarios restantes.
      let cant: number = this.rangoUsers.beforeValue - this.rangoUsers.value;
      for (let i = (this.rangoUsers.beforeValue - 1); i >= this.rangoUsers.value; i--) {
        console.log(this.backupService.userBackups[this.usersSelected[i].index].checked);
        this.backupService.userBackups[this.usersSelected[i].index].checked = false;
        console.log("this.backupService.userBackups[" + this.usersSelected[i].index + "].checked", this.backupService.userBackups[this.usersSelected[i].index].checked);
      }
      /*for (let i = (this.usersSelected.length - 1); i >= this.rangoUsers.value; i--) {
        console.log(this.backupService.userBackups[i].checked);
        this.backupService.userBackups[i].checked = false;
        console.log("this.backupService.userBackups[" + i + "].checked", this.backupService.userBackups[i].checked);
      }*/
      this.usersSelected.splice(this.rangoUsers.value, cant);
      console.log("this.usersSelected", this.usersSelected);
    }
  }
  private beforeBlurRangoUsers() {
    this.rangoUsers.beforeValue = this.rangoUsers.value;
  }

  public detalleUsuario(index) {
    this.backupService.indexUser = index;
    this.userService.User = this.backupService.userBackups[this.backupService.indexUser];
    //console.log(this.backupService.userBackups[this.backupService.indexUser].backups);
    console.log(this.backupService.userBackups[this.backupService.indexUser].collapsed);
    if (!this.backupService.userBackups[this.backupService.indexUser].collapsed || this.backupService.userBackups[this.backupService.indexUser].collapsed == undefined) {
      this.msj = "Cargando backups del usuario: " + this.backupService.userBackups[this.backupService.indexUser].email;
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
}
