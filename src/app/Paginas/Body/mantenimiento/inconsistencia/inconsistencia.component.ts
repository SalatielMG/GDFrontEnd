import { Component } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {ActivatedRoute, Router} from '@angular/router';
import {BackupService} from "../../../../Servicios/backup/backup.service";
import {FiltrosSearchBackups} from "../../../../Modelos/Backup/filtros-search-backups";
import {UsersBackupsMnt} from '../../../../Modelos/users/usersBackupsMnt';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-inconsistencia',
  templateUrl: './inconsistencia.component.html',
  styleUrls: ['./inconsistencia.component.css']
})
export class InconsistenciaComponent {

  public email: string = "";
  public backup = ["0"];
  public backupIndex = ["0"];
  public backupTemp = [];
  public backupIndexTemp = [];
  public todo: boolean = false;
  public errorValidacionUserBackup: boolean = true;

  constructor(public usuarioServicio: UsuarioService, public backupService: BackupService, public util: Utilerias,  public route: ActivatedRoute,
              public router: Router) {
    this.search();
  }
  public changeOptionSelect(event) {
    this.todo = false;
    let indices = [];
    this.searchWithFilter();
    for (let option of event.target.selectedOptions) {
      let key = option.value.split(":");
      indices.push(key[0]);
      if (key[0] == "0") {
        this.todo = true;
        this.deseleccionarEventoTodo();
        return;
      }
    }
    this.backupIndex = indices;
  }
  public search(isFiltro = false) {
    if (this.email.length == 0) {
      this.util.userMntInconsistencia.email = "Generales";
      this.util.userMntInconsistencia.id = "0";
      this.compararRutaHija(this.router.url, isFiltro);
    } else {
      if ((this.util.regex_email).exec(this.email)) {
        this.util.userMntInconsistencia.email = this.email;
        this.compararRutaHija(this.router.url, isFiltro);
      } else {
        this.util.msjToast("Porfavor ingrese un correo valido", "Email no Valido", true);
      }
    }
  }
  public resetVariables() {
  this.backup = ["0"];
  this.backupIndex = ["0"];
  this.backupTemp = [];
  this.backupIndexTemp = [];
  this.todo = true;
  this.errorValidacionUserBackup = true;

  this.backupService.userBackups = [];
  this.backupService.userBackups.push(new UsersBackupsMnt());
  this.backupService.userBackups[this.backupService.indexUser].filtrosSearch = new FiltrosSearchBackups();
  this.backupService.userBackups[this.backupService.indexUser].backupsFiltro = [];
  }
  public compararRutaHija(ruta, isFiltro) {
    if (!isFiltro) {
      this.backupService.resetearBackups();
      this.resetVariables();
      this.buscarBackups().then(() => {
        if (!this.errorValidacionUserBackup) this.routeNavigate(ruta, isFiltro);
      });
    } else {
      this.routeNavigate(ruta, isFiltro);
    }
  }
  public routeNavigate(ruta, isFiltro)  {
    let route = ruta.split("/");
    if (route.length == 3) return;
    ruta = route[3];
    this.navegacion(ruta, isFiltro);
  }
  public buscarBackups() {
    let promise;
    if (this.backupService.pagina == 0) { // Es la primera busqueda implica un loading
      promise = new Promise(()=>{
        this.util.msjLoading = "Validando usuario" + ((this.util.userMntInconsistencia.email == "Generales") ? "s ": ": ") + this.util.userMntInconsistencia.email + " y backups relacionados ";
        this.util.crearLoading().then(() => {
          return this.backupService.buscarBackupsUserEmail(this.util.userMntInconsistencia.email, this.backupService.pagina).subscribe(result => {
            this.util.detenerLoading();
            this.util.loadingModal = false;
            this.util.msjModal = result.msj;
            this.errorValidacionUserBackup = result.error;

            if (!result.error) {
              this.util.QueryComplete.isComplete = false;
              this.backupService.pagina += 1;
              this.backupService.userBackups[this.backupService.indexUser].backups = this.backupService.userBackups[this.backupService.indexUser].backups.concat(result.backups);
              this.util.userMntInconsistencia.id = result.id_user;
            } else {
              if (this.backupService.pagina == 0) {
                this.util.QueryComplete.isComplete = false;
                this.util.msjToast(result.msj, result.titulo, result.error);
              } else {
                this.util.QueryComplete.isComplete = true;
              }
            }
          }, error => {
            this.util.msjErrorInterno(error, true, true);
          });
        });
      });

    } else {
      promise = new Promise(() => {
        this.backupService.buscarBackupsUserEmail(this.util.userMntInconsistencia.email, this.backupService.pagina).subscribe(result => {
          this.util.loadingModal = false;
          this.util.msjModal = result.msj;

          if (!result.error) {
            this.util.QueryComplete.isComplete = false;
            this.backupService.pagina += 1;
            this.backupService.userBackups[this.backupService.indexUser].backups = this.backupService.userBackups[this.backupService.indexUser].backups.concat(result.backups);
          } else {
            if (this.backupService.pagina == 0) {
              this.util.QueryComplete.isComplete = false;
              this.util.msjToast(result.msj, result.titulo, result.error);
            } else {
              this.util.QueryComplete.isComplete = true;
            }
          }
        }, error => {
          this.util.msjErrorInterno(error, false, false);
        });
      });
    }
    return promise;

  }
  public navegacion(tabla, isFilter) {
    if (isFilter) {
      this.router.navigate([tabla, this.stringyfyJSON()], {relativeTo: this.route});
    } else {
      this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
        this.router.navigate([tabla, this.stringyfyJSON()], {relativeTo: this.route});
      });
    }
  }
  public stringyfyJSON() {
    return JSON.stringify(this.backup);
  }
  public operacion() {
    this.util.msjLoading = "Corrigiendo inconsistencia de datos en la Tabla : " + this.nameTable;
    this.util.crearLoading().then(() => {
      this.backupService.corregirInconsistencia(this.nameTable, this.usuarioServicio.usuarioCurrent.id).subscribe(result => {
        this.util.detenerLoading();
        if (result.indice) { //Existe indice
           this.util.msjToast(result.msj, result.titulo, result.indice);
        } else {
          this.navegacion(this.nameTable, false);
          for (let res of result.Result) {
            this.util.msjToast(res.msj, res.titulo, res.error);
          }
        }
        this.util.cerrarModal("#modalConfirmInconsistencia");
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public nameTable: string = "";
  public corregirTabla(){
    this.nameTable = "";
    let route = this.router.url.split("/");
    if (route.length == 3) return;
    this.nameTable = route[3];
    this.util.abrirModal("#modalConfirmInconsistencia");
    // this.operacion();
  }
  public onScroll() {
    if (!this.backupService.isFilter()) this.buscarBackups();
  }
  public checkBackup(index) {
    if (this.backupService.userBackups[this.backupService.indexUser].backups[index].checked) {//[Esta Activo] => [Se desactiva] :: {Eliminacion del arrary temporal}
      let pos = this.backupTemp.indexOf(this.backupService.userBackups[this.backupService.indexUser].backups[index].id_backup);
      if (pos != -1) {
        this.backupTemp.splice(pos,1);
        this.backupIndexTemp.splice(pos,1);
      }
    } else {
      if (!this.backupTemp.includes(this.backupService.userBackups[this.backupService.indexUser].backups[index].id_backup)) {
        this.backupTemp.push(this.backupService.userBackups[this.backupService.indexUser].backups[index].id_backup);
        this.backupIndexTemp.push(index);
      }
    }
    this.backupService.userBackups[this.backupService.indexUser].backups[index].checked = !this.backupService.userBackups[this.backupService.indexUser].backups[index].checked;
  }
  public guardarValorBackups() {
    this.reset();
    this.backup = this.backup.concat(this.backupTemp);
    this.backupIndex =  this.backupIndex.concat(this.backupIndexTemp);
    this.searchWithFilter();
  }
  public searchWithFilter() {
    this.lengthBackupFilter();
    this.search(true);
  }
  public lengthBackupFilter() {
    if (this.backup.length == 0) {
      alert("Porfavor filtre el(los) backup(s) " + ((this.util.userMntInconsistencia.email == "Generales") ? "de los usuarios " : "del usuario : ") + this.util.userMntInconsistencia.email);
      return;
    }
  }
  public reset() {
    this.backup = [];
    this.backupIndex = [];
  }
  public resetTemp() {
    this.backupTemp = [];
    this.backupIndexTemp = [];
  }
  public cerrarModal() {
    if (this.backupIndexTemp.length >= this.backupIndex.length) { //--- Deselecciona ---//
      let deseleccionar = this.backupIndexTemp.filter(el => !this.backupIndex.includes(el));
      for(let index of deseleccionar) {
        this.backupService.userBackups[this.backupService.indexUser].backups[index].checked = false;
      }
    } else  { //--- Selecciona ---//
      let seleccionar = this.backupIndex.filter(el => !this.backupIndexTemp.includes(el));
      for(let index of seleccionar) {
        this.backupService.userBackups[this.backupService.indexUser].backups[index].checked = true;
      }
    }
    this.resetTemp();
    this.backupIndexTemp = this.backupIndexTemp.concat(this.backupIndex);
    this.backupTemp = this.backupTemp.concat(this.backup);
    //----------------------------------------------------------------------------------
  }
  public abrirModal() {
    if (this.todo) {
      this.deseleccionarEventoTodo();
      return;
    }
    if (this.backupIndex.length >= this.backupIndexTemp.length) { //--- Los sobrantes se seleccionanan
      let seleccionar = this.backupIndex.filter(el => !this.backupIndexTemp.includes(el));
      for(let index of seleccionar) {
        this.backupService.userBackups[this.backupService.indexUser].backups[index].checked = true;
      }
    } else { // -- Los faltantes se deseleccionan
      let deseleccionar = this.backupIndexTemp.filter(el => !this.backupIndex.includes(el));
      for(let index of deseleccionar) {
        this.backupService.userBackups[this.backupService.indexUser].backups[index].checked = false;
      }
    }
    this.resetTemp();
    this.backupIndexTemp = this.backupIndexTemp.concat(this.backupIndex);
    this.backupTemp = this.backupTemp.concat(this.backup);
  }
  
  public todosBackups(event) {
    this.todo = event.target.checked;
    if (this.todo) {
      this.deseleccionarEventoTodo();
    } else {
      this.resetTemp();
      this.reset();
    }
  }
  public deseleccionarEventoTodo() {
      for (let index of this.backupIndexTemp) {
        this.backupService.userBackups[this.backupService.indexUser].backups[index].checked = false;
      }
      this.resetearFiltroSearch();
      this.resetTemp();
      this.reset();
      this.backupIndexTemp.push("0");
      this.backupIndex.push("0");
      this.backup.push("0");
      this.backupTemp.push("0");
  }
  public resetearFiltroSearch() {
    this.backupService.userBackups[this.backupService.indexUser].filtrosSearch = new FiltrosSearchBackups();
  }

}
