import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {ActivatedRoute, Router} from '@angular/router';
import {BackupService} from "../../../../Servicios/backup/backup.service";
import {Backup} from "../../../../Modelos/Backup/backup";
import {FiltrosSearchBackups} from "../../../../Modelos/Backup/filtros-search-backups";

@Component({
  selector: 'app-inconsistencia',
  templateUrl: './inconsistencia.component.html',
  styleUrls: ['./inconsistencia.component.css']
})
export class InconsistenciaComponent implements OnInit {

  private email: string = "";
  private backup = ["0"];
  private backupIndex = ["0"];
  private backupTemp = [];
  private backupIndexTemp = [];
  private todo: boolean = false;
  private errorValidacionUserBackup: boolean = true;

  private filtrosSearch = new FiltrosSearchBackups();
  private backupsFiltro: Backup[];

  constructor(private backupService: BackupService, private util: Utilerias,  private route: ActivatedRoute,
              private router: Router) {
    // this.resetearFiltroSearch();
    this.search();
  }
  ngOnInit() {
  }
  private changeOptionSelect(event) {
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
  private resetVariables() {
  this.backup = ["0"];
  this.backupIndex = ["0"];
  this.backupTemp = [];
  this.backupIndexTemp = [];
  this.todo = true;
  this.errorValidacionUserBackup = true;

  this.filtrosSearch = new FiltrosSearchBackups();
  this.backupsFiltro= [];
  }
  private compararRutaHija(ruta, isFiltro) {
    if (!isFiltro) {
      this.backupService.resetearBaackups();
      this.resetVariables();
      this.buscarBackups().then(() => {
        if (!this.errorValidacionUserBackup) this.routeNavigate(ruta, isFiltro);
      });
    } else {
      this.routeNavigate(ruta, isFiltro);
    }
  }
  private routeNavigate(ruta, isFiltro)  {
    let route = ruta.split("/");
    if (route.length == 3) return;
    ruta = route[3];
    this.navegacion(ruta, isFiltro);
  }
  private buscarBackups() {
    let promise;
    if (this.backupService.paginaB == 0) { // Es la primera busqueda implica un loading
      promise = new Promise(()=>{
        this.util.msjLoading = "Validando usuario" + ((this.util.userMntInconsistencia.email == "Generales") ? "s ": ": ") + this.util.userMntInconsistencia.email + " y backups relacionados ";
        this.util.crearLoading().then(() => {
          return this.backupService.buscarBackupsUserEmail(this.util.userMntInconsistencia.email, this.backupService.paginaB).subscribe(result => {
            this.util.detenerLoading();
            this.util.loadingModal = false;
            this.util.msjModal = result.msj;
            this.errorValidacionUserBackup = result.error;

            if (!result.error) {
              this.util.QueryComplete.isComplete = false;
              this.backupService.paginaB += 1;
              this.backupService.backups = this.backupService.backups.concat(result.backups);
              this.util.userMntInconsistencia.id = result.id_user;
            } else {
              if (this.backupService.paginaB == 0) {
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
        this.backupService.buscarBackupsUserEmail(this.util.userMntInconsistencia.email, this.backupService.paginaB).subscribe(result => {
          this.util.loadingModal = false;
          this.util.msjModal = result.msj;

          if (!result.error) {
            this.util.QueryComplete.isComplete = false;
            this.backupService.paginaB += 1;
            this.backupService.backups = this.backupService.backups.concat(result.backups);
          } else {
            if (this.backupService.paginaB == 0) {
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
  private navegacion(tabla, isFilter) {
    if (isFilter) {
      this.router.navigate([tabla, this.stringyfyJSON()], {relativeTo: this.route});
    } else {
      this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
        this.router.navigate([tabla, this.stringyfyJSON()], {relativeTo: this.route});
      });
    }
  }
  private stringyfyJSON() {
    return JSON.stringify(this.backup);
  }
  private operacion(tabla) {
    let opcion = confirm("¿ Desea corregir las inconsistencias de la Tabla : "+ tabla +" ? ");
    if (opcion) {
      this.util.msjLoading = "Corrigiendo inconsistencia de datos en la Tabla : " + tabla;
      this.util.crearLoading().then(() => {
        this.backupService.corregirInconsistencia(tabla).subscribe(result => {
          this.util.detenerLoading();
          if (result.indice) { //Existe indice
             this.util.msjToast(result.msj, result.titulo, result.indice);
          } else {
            this.navegacion(tabla, false);
            for (let res of result.Result) {
              this.util.msjToast(res.msj, res.titulo, res.error);
            }
          }
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    }
  }
  public corregirTabla(){
    let route = this.router.url.split("/");
    if (route.length == 3) return;
    let ruta = route[3];
    this.operacion(ruta);
  }
  public onScroll() {
    if (!this.isFilter()) this.buscarBackups();
  }
  public checkBackup(index) {
    if (this.backupService.backups[index].checked) {//[Esta Activo] => [Se desactiva] :: {Eliminacion del arrary temporal}
      let pos = this.backupTemp.indexOf(this.backupService.backups[index].id_backup);
      if (pos != -1) {
        this.backupTemp.splice(pos,1);
        this.backupIndexTemp.splice(pos,1);
      }
    } else {
      if (!this.backupTemp.includes(this.backupService.backups[index].id_backup)) {
        this.backupTemp.push(this.backupService.backups[index].id_backup);
        this.backupIndexTemp.push(index);
      }
    }
    this.backupService.backups[index].checked = !this.backupService.backups[index].checked;
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
  private searchWithFilter() {
    this.lengthBackupFilter();
    this.search(true);
  }
  private lengthBackupFilter() {
    if (this.backup.length == 0) {
      alert("Porfavor filtre el(los) backup(s) " + ((this.util.userMntInconsistencia.email == "Generales") ? "de los usuarios " : "del usuario : ") + this.util.userMntInconsistencia.email);
      return;
    }
  }
  private reset() {
    this.backup = [];
    this.backupIndex = [];
  }
  private resetTemp() {
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
        this.backupService.backups[index].checked = false;
      }
    } else  { //--- Selecciona ---//
      let seleccionar = this.backupIndex.filter(el => !this.backupIndexTemp.includes(el));
      console.log(seleccionar);
      for(let index of seleccionar) {
        this.backupService.backups[index].checked = true;
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
        this.backupService.backups[index].checked = true;
      }
    } else { // -- Los faltantes se deseleccionan
      let deseleccionar = this.backupIndexTemp.filter(el => !this.backupIndex.includes(el));
      console.log(deseleccionar);
      for(let index of deseleccionar) {
        this.backupService.backups[index].checked = false;
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
  private deseleccionarEventoTodo() {
      for (let index of this.backupIndexTemp) {
        this.backupService.backups[index].checked = false;
      }
      this.resetearFiltroSearch();
      this.resetTemp();
      this.reset();
      this.backupIndexTemp.push("0");
      this.backupIndex.push("0");
      this.backup.push("0");
      this.backupTemp.push("0");
  }
  private resetearFiltroSearch() {
    this.filtrosSearch = new FiltrosSearchBackups();
  }

  //-----------------------------------------------------------------------
  private actionFilterEvent(event, value, isKeyUp = false) {
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
  private resetFilterisActive() {
    if (!this.isFilter()) {
      this.backupsFiltro = [];
      this.backupsFiltro =  this.backupsFiltro.concat(this.backupService.backups);
    }
  }
  private proccessFilter() {
    let temp = [];
    this.backupService.backups.forEach((back) => {
      if (back.id_backup != 0) {

        let bnd = true;
        for (let k in this.filtrosSearch) {
          if (this.filtrosSearch[k].isFilter) {
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

  private resetValuefiltroSearch(key) {
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

  private isFilter(): boolean {
    for (let key in this.filtrosSearch) {
      if (this.filtrosSearch[key].isFilter) return true;
    }
    return false;
  }

}
