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
    this.searchWithFilter();
  }
  public search(isFiltro = false) {
    console.log("email user:", this.email);
    if (this.email.length == 0) {
      this.util.emailUserMntInconsistencia = "Generales";
      this.compararRutaHija(this.router.url, isFiltro);
    } else {
      if ((this.util.regex_email).exec(this.email)) {
        this.util.emailUserMntInconsistencia = this.email;
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

  this.filtrosSearch = new FiltrosSearchBackups();
  this.backupsFiltro= [];
  }
  private compararRutaHija(ruta, isFiltro) {
    if (!isFiltro) {
      this.backupService.resetearBaackups();
      this.resetVariables();
      this.buscarBackups();
    }
    switch (ruta) {
      case "/mantenimiento/inconsistenciaMnt/accounts":
        this.navegacion("accounts", isFiltro);
        break;
      case "/mantenimiento/inconsistenciaMnt/automatics":
        this.navegacion("automatics", isFiltro);
        break;
      case "/mantenimiento/inconsistenciaMnt/budgets":
        this.navegacion("budgets", isFiltro);
        break;
      case "/mantenimiento/inconsistenciaMnt/cardviews":
        this.navegacion("cardviews", isFiltro);
        break;
      case "/mantenimiento/inconsistenciaMnt/categories":
        this.navegacion("categories", isFiltro);
        break;
      case "/mantenimiento/inconsistenciaMnt/currencies":
        this.navegacion("currencies", isFiltro);
        break;
      case "/mantenimiento/inconsistenciaMnt/extras":
        this.navegacion("extras", isFiltro);
        break;
      case "/mantenimiento/inconsistenciaMnt/movements":
        this.navegacion("movements", isFiltro);
        break;
      case "/mantenimiento/inconsistenciaMnt/preferences":
        this.navegacion("preferences", isFiltro);
        break;
    }
  }
  private buscarBackups() {
    this.backupService.buscarBackupsUserEmail(this.util.emailUserMntInconsistencia, this.backupService.paginaB).subscribe(result => {
      this.util.loadingModal = false;
      this.util.msjModal = result.msj;
      if (!result.error) {
        this.backupService.paginaB += 1;
        this.backupService.backups = this.backupService.backups.concat(result.backups);
      }
    }, error => {
      this.util.msjErrorInterno(error, false, false);
    });
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
          this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
            this.util.detenerLoading();
            this.router.navigate([tabla], {relativeTo: this.route});
            for (let res of result.Result) {
              this.util.msjToast(res.msj, res.titulo, res.error);
            }
          }, error => {
            this.util.msjErrorInterno(error);
          });
        });
      });
    }
  }
  public corregirTabla(){
    switch (this.router.url) {
      case "/mantenimiento/inconsistenciaMnt/accounts":
        this.operacion("accounts");
        break;
      case "/mantenimiento/inconsistenciaMnt/automatics":
        this.operacion("automatics");
        break;
      case "/mantenimiento/inconsistenciaMnt/budgets":
        this.operacion("budgets");
        break;
      case "/mantenimiento/inconsistenciaMnt/cardviews":
        this.operacion("cardviews");
        break;
      case "/mantenimiento/inconsistenciaMnt/categories":
        this.operacion("categories");
        break;
      case "/mantenimiento/inconsistenciaMnt/currencies":
        this.operacion("currencies");
        break;
      case "/mantenimiento/inconsistenciaMnt/extras":
        this.operacion("extras");
        break;
      case "/mantenimiento/inconsistenciaMnt/movements":
        this.operacion("movements");
        break;
      case "/mantenimiento/inconsistenciaMnt/preferences":
        this.operacion("preferences");
        break;
    }
  }
  public onScroll() {
    if (!this.isFilter()) {
      console.log("Scrolled !!!");
      this.buscarBackups();
    }
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
    if (this.backup.length == 0) {
      alert("Porfavor filtre el(los) backup(s) " + ((this.util.emailUserMntInconsistencia == "Generales") ? "de los usuarios " : "del usuario : ") + this.util.emailUserMntInconsistencia);
      return;
    }
    this.search(true);
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
