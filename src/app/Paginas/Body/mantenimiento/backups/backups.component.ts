import { Component, ElementRef, OnInit, ViewChildren, Renderer2 } from '@angular/core';
import { Utilerias } from '../../../../Utilerias/Util';
import { BackupService } from "../../../../Servicios/backup/backup.service";
import { CampoNumerico } from '../../../../Utilerias/validacionCampoNumerico';
import { UserSelect } from "./userSelect";
import {FiltrosSearchBackupsUser} from "../../../../Modelos/Backup/filtros-search-backups-user";

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

  @ViewChildren("cntBackupsUser") cntBackupsUser = ElementRef;

  constructor(private util: Utilerias, private backupService: BackupService, private renderer: Renderer2) {
    this.usersSelected = [];
    this.resetearVariables();
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
  private resetearVariables() {
    this.pagina = 0;
    this.backupService.userBackupsMnt = [];
  }
  public search() {
    this.resetearVariables();
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
      this.util.QueryComplete.isComplete = false;
      this.pagina += 1;
      this.backupService.userBackupsMnt = this.backupService.userBackupsMnt.concat(result.backups);
      //let nuevoBack = this.backupService.userBackupsMnt.concat(result.backups);
      console.log("this.backupService.userBackupsMnt", this.backupService.userBackupsMnt);
    } else {
      if (this.pagina == 0) {
        this.util.QueryComplete.isComplete = false;
      } else {
        this.util.QueryComplete.isComplete = true;
      }
    }
    this.util.loadingMain = false;
    // console.log(result);
  }

  public verficarExpansion(indice, idUser, email) {
    if (!this.backupService.userBackupsMnt[indice].collapsed) { // Expandir
      this.msj = "Cargando backups del usuario: " + email;
      this.util.crearLoading().then(() => {
        this.backupService.buscarBackupsUserId(idUser, '-1' ,'asc').subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          this.backupService.userBackupsMnt[indice].msj = result.msj;
          this.backupService.userBackupsMnt[indice].cantRep = result.backups.length;
          console.log(result.backups);

          if (!result.error){
            this.backupService.userBackupsMnt[indice].filtrosSearch = new FiltrosSearchBackupsUser();
            this.backupService.userBackupsMnt[indice].backupsFiltro = [];
            this.backupService.userBackupsMnt[indice].backups = result.backups;
            this.expandir(575, 13, this.cntBackupsUser['_results'][indice].nativeElement);
            this.backupService.userBackupsMnt[indice].collapsed  = true;
          }
        }, error =>  {
          this.util.msjErrorInterno(error);
        });
      });
    } else { // Minimizar
      this.minimizar(this.cntBackupsUser['_results'][indice].nativeElement);
      this.backupService.userBackupsMnt[indice].collapsed  = false;
      this.backupService.userBackupsMnt[indice].backupsFiltro = [];
      this.backupService.userBackupsMnt[indice].backups = [];

    }
    // this.backupService.userBackupsMnt[indice].collapsed  = !this.backupService.userBackupsMnt[indice].collapsed;
    console.log(this.backupService.userBackupsMnt[indice].collapsed );
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
  public eliminar(i, indiceBackup, back, isFilter = false) {
    let index = indiceBackup[0];
    //let bnd = this.isFilter(i);
    if (isFilter) {
      index = <number>this.backupService.userBackupsMnt[i].backups.indexOf(back);
    }
    console.log(this.backupService.userBackupsMnt[i].backups[index]);
    let opcion = confirm("¿ Esta seguro de eliminar el Respaldo num: " + (index + 1) + ", Id_Backup: " + back.id_backup + "?");
    if (opcion) {
      // On Delete On Cascada.
      this.util.crearLoading().then(()=> {
        this.backupService.eliminarBackup(back.id_backup).subscribe(
          result => {
            this.util.detenerLoading();
            this.util.msjToast(result.msj, result.titulo, result.error);
            if (!result.error) {
              if (isFilter) {
                if (index != -1) this.backupService.userBackupsMnt[i].backups.splice((index), 1);
                this.backupService.userBackupsMnt[i].backupsFiltro.splice(indiceBackup[1], 1);
              } else {
                this.backupService.userBackupsMnt[i].backups.splice(index, 1);
              }
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

  private limpiarBackupsUser(isUserSelected: boolean = true, userSpecified =  null, i = 0) {
    let users: UserSelect[] = [];
    if (isUserSelected) {
      users = users.concat(this.usersSelected);
    } else {
      let user = new UserSelect(userSpecified.id_user, userSpecified.email, userSpecified.cantRep, i);
      users.push(user);
    }

    if (users.length == 0) {
      this.util.msjToast("Porfavor selecione a los usuarios a limpiar", "", true);
      return;
    }

    let Quien = "";
    for (let user of users)
      Quien = Quien + user.email + ", \n";
    let opcion = confirm("¿ Estas seguro de limpiar los backups del usuario: ?\n" + Quien);

    // Process

    if (opcion) {
      this.msj = "Limpiando backups :\n" + Quien;
      this.util.crearLoading().then(() => {
        this.backupService.limpiarBackupsUsers(users, this.rangoBackups.value).subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          for (let resultUser of result.resultCleanBackupsUser) {
            this.util.msjToast(resultUser.msj, "", resultUser.error);
            console.log("resultUser:=", resultUser);
            /*if (resultUser.error == "success") {
            } else {
              console.log("Limpiado SIN exito:=", resultUser);
            }*/
          }
          /*if (result.error) { //Error => NO Resetear userSelected, eliminar de la lista los user limpiados.
          } else { //Success => Resetear userSelected y seleccionar los siguientes user [10]
            /*if (users.length == 1) {
              this.backupService.userBackupsMnt.splice(users[0].index, 1);
            } else {
              let backups = [];
              users.forEach((user) => {
                backups.push(this.backupService.userBackupsMnt[user.index]);
              });
              users.forEach((user, index) => {
                let i = this.backupService.userBackupsMnt.indexOf(backups[index]);
                if (i != -1) {
                  this.backupService.userBackupsMnt.splice(i, 1);
                }
              });
            }*/
          //}
          if (isUserSelected) {
            this.search();

            /*if (users.length > 1) {
              this.search();
            } else {
              this.usersSelected = [];
              this.backupService.userBackupsMnt = [];
            }*/
          } else {
            this.backupService.userBackupsMnt.splice(i, 1);
            this.usersSelected.forEach((user, index) => {
              if (user.index == i) {
                this.usersSelected.splice(index, 1);
                this.rangoUsers.value = this.usersSelected.length;
                this.rangoUsers.beforeValue = this.usersSelected.length;
              }
            });
          }
          users = [];
        }, error => {
          this.util.msjErrorInterno(error);
          users = [];
        });
      });
    }

    // Process

    console.log("users Selected:=", users);
  }

  private limpiarBackups(idUser, email, cantidad, pos = 0) {
    if (this.usersSelected.length == 0) {
      this.util.msjToast("Porfavor seleccione a los usuarios a limpiar", "", true);
      return;
    }
    if (email == "Generales") {
      idUser = 0;
    } else {
      idUser = this.backupService.userBackupsMnt[0].id_user;
      cantidad = this.backupService.userBackupsMnt[0].cantRep;
    }
    let Quien = "";
    for (let user of this.usersSelected){
      Quien = Quien + this.backupService.userBackupsMnt[user.index]["email"] + ", \n";
    }
    let opcion = confirm("¿ Estas seguro de limpiar los backups del usuario: ?\n" + Quien);
    if (opcion) {
      this.msj = "Limpiando backups " + Quien;
      this.util.crearLoading().then(() => {
        this.backupService.limpiarBackups(idUser, email, this.rangoBackups.value, cantidad).subscribe(result => {
          this.util.detenerLoading();
          if (!result.error) {
            if (idUser != 0) { // Un solo usuario
              this.backupService.userBackupsMnt.splice(pos, 1);
            } else { // General
              this.backupService.userBackupsMnt = [];
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
    console.log("After Event Collapse Activated:= ", this.backupService.userBackupsMnt[index]);
    console.log("this.backupService.userBackupsMnt[index].checked ", this.backupService.userBackupsMnt[index].checked);
    if (!this.backupService.userBackupsMnt[index].checked || this.backupService.userBackupsMnt[index].checked == undefined) { //Checked => push userSelected
      let user = new UserSelect(this.backupService.userBackupsMnt[index].id_user, this.backupService.userBackupsMnt[index]["email"], this.backupService.userBackupsMnt[index]["cantRep"], index);
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
    this.backupService.userBackupsMnt[index].checked = !this.backupService.userBackupsMnt[index].checked;
    console.log("Before Event Collapse Activated:= ", this.backupService.userBackupsMnt[index]);
    console.log("this.usersSelected", this.usersSelected);
  }
  private collapseSelected() {
    this.usersSelected = [];
    this.rangoUsers.value = 10;
    this.rangoUsers.beforeValue = 10;
    console.log("this.rangoUsers.value", this.rangoUsers.value);
    if (this.backupService.userBackupsMnt.length >= this.rangoUsers.value) {
      for (let i = 0; i < this.rangoUsers.value; i++) {
        this.backupService.userBackupsMnt[i].checked = true;
        console.log("this.backupService.userBackupsMnt[" + i + "].checked", this.backupService.userBackupsMnt[i].checked);
        let user = new UserSelect(this.backupService.userBackupsMnt[i].id_user, this.backupService.userBackupsMnt[i]["email"], this.backupService.userBackupsMnt[i]["cantRep"], i);
        this.usersSelected.push(user);
      }
    } else {
      this.usersSelected = [];
      this.backupService.userBackupsMnt.forEach((back, index) => {
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
      this.resetearVariables();
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
      this.afterBlurRangoUsers(event);
      this.beforeBlurRangoUsers(event);
    }
  }
  private afterBlurRangoUsers(event) {// Evento filtroSeleccionar
    console.log("this.rangoUsers", this.rangoUsers);
    if (this.rangoUsers.value > this.rangoUsers.beforeValue) { //Selecionar usuarios faatantes
      let faltantes = this.rangoUsers.value - this.rangoUsers.beforeValue;
      console.log("Usuarios faltantes", faltantes);

      this.backupService.userBackupsMnt.forEach((back, index) => {
        if (faltantes == 0) return;
        if (!back.checked || back.checked == undefined) {
          this.backupService.userBackupsMnt[index].checked = true;
          let user = new UserSelect(back.id_user, back["email"], back["cantRep"], index);
          this.usersSelected.push(user);
          faltantes -= 1;
        }
        console.log("encontrado faltantes", faltantes);
      });
    } else { //Deseleccionar usuarios restantes.
      for (let i = (this.usersSelected.length - 1); i >= this.rangoUsers.value; i--) {
        this.backupService.userBackupsMnt[i].checked = false;
      }
      this.usersSelected.splice(this.rangoUsers.value, (this.rangoUsers.beforeValue - this.rangoUsers.value));
      console.log("this.usersSelected", this.usersSelected);
    }
  }
  private beforeBlurRangoUsers(event) {
    this.rangoUsers.beforeValue = this.rangoUsers.value;
  }

  // -------------------------------- Filter Backups User --------------------------------
  private actionFilterEvent(index, event, value, isKeyUp = false) {
    if (value == "automatic") {
      if (this.backupService.userBackupsMnt[index].filtrosSearch[value].value == "-1") {
        this.backupService.userBackupsMnt[index].filtrosSearch[value].isFilter = false;
        this.backupService.userBackupsMnt[index].filtrosSearch[value].valueAnt = this.backupService.userBackupsMnt[index].filtrosSearch[value].value;
        this.proccessFilter(index);
        return;
      }
    } else {
      if (isKeyUp && event.key != "Enter") return;
      if (this.backupService.userBackupsMnt[index].filtrosSearch[value].value == "") return;
    }
    if (this.backupService.userBackupsMnt[index].filtrosSearch[value].value == this.backupService.userBackupsMnt[index].filtrosSearch[value].valueAnt) return;
    this.resetFilterisActive(index);
    this.backupService.userBackupsMnt[index].filtrosSearch[value].isFilter = true;
    this.backupService.userBackupsMnt[index].filtrosSearch[value].valueAnt = this.backupService.userBackupsMnt[index].filtrosSearch[value].value;
    this.proccessFilter(index);
  }
  private resetValuefiltroSearch(index, key) {
    this.backupService.userBackupsMnt[index].filtrosSearch[key].value =  "";
    this.backupService.userBackupsMnt[index].filtrosSearch[key].valueAnt =  "";
    this.backupService.userBackupsMnt[index].filtrosSearch[key].isFilter =  false;
    if (key == "automatic") this.backupService.userBackupsMnt[index].filtrosSearch[key].value = "-1";

    if (!this.isFilter(index)) {
      this.backupService.userBackupsMnt[index].backupsFiltro = [];
      return;
    }
    this.proccessFilter(index);
  }
  private resetFilterisActive(index) {
    if (!this.isFilter(index)) {
      this.backupService.userBackupsMnt[index].backupsFiltro = [];
      this.backupService.userBackupsMnt[index].backupsFiltro =  this.backupService.userBackupsMnt[index].backupsFiltro.concat(this.backupService.userBackupsMnt[index].backups);
    }
  }
  private proccessFilter(index) {
    let temp = [];
    this.backupService.userBackupsMnt[index].backups.forEach((back) => {
      if (back.id_backup != 0) {

        let bnd = true;
        for (let k in this.backupService.userBackupsMnt[index].filtrosSearch) {
          if (this.backupService.userBackupsMnt[index].filtrosSearch[k].isFilter) {
            if (k == "automatic" && this.backupService.userBackupsMnt[index].filtrosSearch[k].value != "-1") {
              if (back[k].toString() != this.backupService.userBackupsMnt[index].filtrosSearch[k].value) {
                bnd = false;
                break;
              }
            } else {
              if (!back[k].toString().includes(this.backupService.userBackupsMnt[index].filtrosSearch[k].value)){
                bnd = false;
                break;
              }
            }
          }
        }

        if (bnd) {
          temp.push(back);
        }
      }
    });
    this.backupService.userBackupsMnt[index].backupsFiltro = [];
    this.backupService.userBackupsMnt[index].backupsFiltro = this.backupService.userBackupsMnt[index].backupsFiltro.concat(temp);
    temp = null;
  }
  private isFilter(index): boolean {
    for (let key in this.backupService.userBackupsMnt[index].filtrosSearch) {
      if (this.backupService.userBackupsMnt[index].filtrosSearch[key].isFilter) return true;
    }
    return false;
  }
  // -------------------------------- Filter Backups User --------------------------------
}
