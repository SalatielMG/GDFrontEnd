import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {ActivatedRoute, Router} from '@angular/router';
import {BackupService} from "../../../../Servicios/backup/backup.service";
import {FiltrosSearchBackups} from "../../../../Modelos/Backup/filtros-search-backups";
import {UsersBackupsMnt} from '../../../../Modelos/users/usersBackupsMnt';

@Component({
  selector: 'app-inconsistencia',
  templateUrl: './inconsistencia.component.html',
  styleUrls: ['./inconsistencia.component.css']
})
export class InconsistenciaComponent implements OnInit {

  public email: string = "";
  public backup = ["0"];
  public backupIndex = ["0"];
  public backupTemp = [];
  public backupIndexTemp = [];
  public todo: boolean = false;
  public errorValidacionUserBackup: boolean = true;

  /*public filtrosSearch = new FiltrosSearchBackups();
  public backupsFiltro: Backup[];*/

  constructor(public backupService: BackupService, public util: Utilerias,  public route: ActivatedRoute,
              public router: Router) {
    // this.resetearFiltroSearch();
    this.search();
  }
  ngOnInit() {
  }
  public changeOptionSelect(event) {
    this.todo = false;
    let indices = [];
    console.log('Valor event:= ', event.target.selectedOptions);
    this.searchWithFilter();
    for (let option of event.target.selectedOptions) {
      console.log(option.value);
      let key = option.value.split(":");
      console.log("key", key);
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
    console.log("email user:", this.email);
    if (this.email.length == 0) {
      this.util.userMntInconsistencia.email = "Generales";
      this.util.userMntInconsistencia.id = "0";
      console.log("util.userMntInconsistencia user:", this.util.userMntInconsistencia);

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
      console.log("is filter true:=", this.util.userMntInconsistencia);
      this.router.navigate([tabla, this.stringyfyJSON()], {relativeTo: this.route});
    } else {
      console.log("is filter false:=", this.util.userMntInconsistencia);

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
      this.backupService.corregirInconsistencia(this.nameTable).subscribe(result => {
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
    console.log("this.backupsTemp", this.backupTemp);
    console.log("this.backupIndexTemp", this.backupIndexTemp);
    console.log("this.backupIndex", this.backupIndex);
  }
  public guardarValorBackups() {
    console.log("//--------------------------------Guardando datos------------------------------//");
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
    //----------------------------------------------------------------------------------
    console.log("//--------------------------------Cerrando modal------------------------------//");
    console.log("this.backupIndexTemp", this.backupIndexTemp);
    console.log("this.backupIndex", this.backupIndex);
    if (this.backupIndexTemp.length >= this.backupIndex.length) { //--- Deselecciona ---//
      let deseleccionar = this.backupIndexTemp.filter(el => !this.backupIndex.includes(el));
      console.log(deseleccionar);
      for(let index of deseleccionar) {
        this.backupService.userBackups[this.backupService.indexUser].backups[index].checked = false;
      }
    } else  { //--- Selecciona ---//
      let seleccionar = this.backupIndex.filter(el => !this.backupIndexTemp.includes(el));
      console.log(seleccionar);
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
    console.log("//--------------------------------Abriendo modal------------------------------//");
    console.log("this.backupIndexTemp", this.backupIndexTemp);
    console.log("this.backupIndex", this.backupIndex);
    console.log("this.id_backup", this.backup);
    console.log("this.backupTemp", this.backupTemp);
    //----------------------------------------------------------------------------------
    if (this.todo) {
      this.deseleccionarEventoTodo();
      return;
    }
    if (this.backupIndex.length >= this.backupIndexTemp.length) { //--- Los sobrantes se seleccionanan
      let seleccionar = this.backupIndex.filter(el => !this.backupIndexTemp.includes(el));
      console.log(seleccionar);
      for(let index of seleccionar) {
        this.backupService.userBackups[this.backupService.indexUser].backups[index].checked = true;
      }
    } else { // -- Los faltantes se deseleccionan
      let deseleccionar = this.backupIndexTemp.filter(el => !this.backupIndex.includes(el));
      console.log(deseleccionar);
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
    console.log(event.target.checked);
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

  /*-----------------------------------------------------------------------
  public actionFilterEvent(event, value, isKeyUp = false) {
    if (value == "automatic") {
      if (this.filtrosSearch[value].value == "-1") {
        this.filtrosSearch[value].isFilter = false;
        this.filtrosSearch[value].valueAnt = this.filtrosSearch[value].value;
        this.proccessFilter();
        return;
      }
    } else {
      if (isKeyUp && event.key != "Enter") return;
      if (this.filtrosSearch[value].value == "") return;
    }
    if (this.filtrosSearch[value].value == this.filtrosSearch[value].valueAnt) return;
    this.resetFilterisActive();
    this.filtrosSearch[value].isFilter = true;
    this.filtrosSearch[value].valueAnt = this.filtrosSearch[value].value;
    this.proccessFilter();
  }
  public resetFilterisActive() {
    if (!this.isFilter()) {
      this.backupsFiltro = [];
      this.backupsFiltro =  this.backupsFiltro.concat(this.backupService.backups);
    }
  }
  public proccessFilter() {
    let temp = [];
    this.backupService.backups.forEach((back) => {
      if (back.id_backup != 0) {

        let bnd = true;
        for (let k in this.filtrosSearch) {
          if (this.filtrosSearch[k].isFilter) { // By filter option is verify emailUser
            if (k == "automatic" && this.filtrosSearch[k].value != "-1") {
              if (back[k].toString() != this.filtrosSearch[k].value) {
                bnd = false;
                break;
              }
            } else {
              if (!back[k].toString().includes(this.filtrosSearch[k].value)){
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
    this.backupsFiltro = [];
    this.backupsFiltro = this.backupsFiltro.concat(temp);
    temp = null;
  }

  public resetValuefiltroSearch(key) {
    // console.log("Resetenado datos de la caja de filtros : " + key);
    this.filtrosSearch[key].value =  "";
    this.filtrosSearch[key].valueAnt =  "";
    this.filtrosSearch[key].isFilter =  false;
    if (key == "automatic") this.filtrosSearch[key].value = "-1";

    if (!this.isFilter()) {
      this.backupsFiltro = [];
      return;
    }
    this.proccessFilter();
  }

  public isFilter(): boolean {
    for (let key in this.filtrosSearch) {
      if (this.filtrosSearch[key].isFilter) return true;
    }
    return false;
  }
  /*-----------------------------------------------------------------------*/

}
