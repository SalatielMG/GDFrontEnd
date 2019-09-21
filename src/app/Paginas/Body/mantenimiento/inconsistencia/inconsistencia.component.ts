import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {ActivatedRoute, Router} from '@angular/router';
import {BackupService} from "../../../../Servicios/backup/backup.service";

@Component({
  selector: 'app-inconsistencia',
  templateUrl: './inconsistencia.component.html',
  styleUrls: ['./inconsistencia.component.css']
})
export class InconsistenciaComponent implements OnInit {

  private email: string = "";
  private backup = [];
  private backupIndex = [];
  private backupTemp = [];
  private backupIndexTemp = [];
  private todo: boolean = false;

  //-----------------------------------------------------------------
  private isSearch: boolean = false;
  private criterioBusqueda: string = "";
  //-----------------------------------------------------------------

  //private backupsModalTemp = [];
  private filtrosSearch = {
    backup: "",
    isbackup: false,
    usuario: "",
    isusuario: false,
    automatico: "-1",
    isautomatico: false,
    creacion: "",
    iscreacion: false,
    descarga: "",
    isdescarga: false,
    version: "",
    isversion: false
  };

  constructor(private backupService: BackupService, private util: Utilerias,  private route: ActivatedRoute,
              private router: Router) {
    this.search();
  }
  ngOnInit() {
  }
  private prueba(event) {
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
  }
  public search() {
    console.log("email user:", this.email);
    if (this.email.length == 0) {
      this.util.emailUserMntInconsistencia = "Generales";
      this.compararRutaHija(this.router.url);
    } else {
      if ((this.util.regex_email).exec(this.email)) {
        this.util.emailUserMntInconsistencia = this.email;
        this.compararRutaHija(this.router.url);
      } else {
        this.util.msjToast("Porfavor ingrese un correo valido", "Email no Valido", true);
      }
    }
  }
  private compararRutaHija(ruta) {
    this.backupService.resetearBaackups();
    //this.backupFiltros = [];
    this.buscarBackups();
    switch (ruta) {
      case "/mantenimiento/inconsistenciaMnt/accounts":
        this.navegacion("accounts");
        break;
      case "/mantenimiento/inconsistenciaMnt/automatics":
        this.navegacion("automatics");
        break;
      case "/mantenimiento/inconsistenciaMnt/budgets":
        this.navegacion("budgets");
        break;
      case "/mantenimiento/inconsistenciaMnt/cardviews":
        this.navegacion("cardviews");
        break;
      case "/mantenimiento/inconsistenciaMnt/categories":
        this.navegacion("categories");
        break;
      case "/mantenimiento/inconsistenciaMnt/currencies":
        this.navegacion("currencies");
        break;
      case "/mantenimiento/inconsistenciaMnt/extras":
        this.navegacion("extras");
        break;
      case "/mantenimiento/inconsistenciaMnt/movements":
        this.navegacion("movements");
        break;
      case "/mantenimiento/inconsistenciaMnt/preferences":
        this.navegacion("preferences");
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
  private navegacion(tabla) {
    this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
      this.router.navigate([tabla], {relativeTo: this.route});
    });
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
    /*if (this.verficarFiltrosActivados() == 0) {

    }*/
    console.log("Scrolled !!!");
    this.buscarBackups();
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
    console.log("this.backup", this.backup);
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
      this.filtrosSearch.backup = "";
      this.filtrosSearch.isbackup = false;
      this.filtrosSearch.usuario = "";
      this.filtrosSearch.isusuario = false;
      this.filtrosSearch.automatico = "-1";
      this.filtrosSearch.isautomatico = false;
      this.filtrosSearch.creacion = "";
      this.filtrosSearch.iscreacion = false;
      this.filtrosSearch.descarga = "";
      this.filtrosSearch.isdescarga = false;
      this.filtrosSearch.version = "";
      this.filtrosSearch.isversion = false;
  }
  //-----------------------------------------------------------------------
  //Busqueda
  public keyUp(event) {
    if (event.key == "Enter") {
      this.filtrarBusqueda();
    }
  }
  public filtrarBusqueda() {
    if (this.criterioBusqueda != "") {
      this.isSearch = true;
      console.log("Busqueda Activada", this.isSearch);
      //---- Operacion Busqueda -----
      //this.backupService.backups.
    }
  }
  public resetearFiltrosBusqueda() {
    this.isSearch = false;
    this.criterioBusqueda = "";
    console.log("Busqueda descativada", this.isSearch);
  }
  //-----------------------------------------------------------------------


  //-----------------------------------------------------------------------
  private selectAumtomatics(event) {
    console.log(event);
    this.filtrosSearch.isautomatico = false;
    if (event != "-1") {
      this.filtrosSearch.isautomatico = true;
    }
  }
  private dateChange(event) {
    console.log(event);
  }
  private eventDate(event, value) {
    if (event != "") {
      this.filtrosSearch["is" + value] = true;
      switch (value) {
        case "creacion":
          break;
        case "descarga":
          break;
      }
      console.log(event);
    }

  }

  /*
  * Si es el primer filtro se activa => se procede a realizar una copia temporal de backupServic.backup
  * Si se desactivan
  * */
  private keyUpSearch(event, value) {
    console.log("event KeyUp:= ", event);
    if (event.key == "Enter") {
      if (this.filtrosSearch[value] == "") return ;
      this.filtrosSearch["is" + value] = true;
      /*if (this.verficarFiltrosActivados() == 1) { // PrimerActivado => Realizar el respaldo
        this.backupsModalTemp = [];
        this.backupsModalTemp = this.backupsModalTemp.concat(this.backupService.backups);
      }*/
      switch (value) {
        case "backup":
          // this.filtroBackup();
          break;
        case "usuario":

          break;
        case "version":

          break;
      }
    }
  }

  // ----------------------------------------------------------------------
  /* ----- Filtro Backup ------ */
  /*private filtroBackup() {
    console.log("Antes:=", this.backupService.backups);
    let contadorDelete = 0;
    let filtroTemp = [];
    console.log("length this.backupsService.length", this.backupService.backups.length);
    let length = this.backupService.backups.length;
    this.backupService.backups.forEach((back, index) => {
      console.log("[" + index + "] := " + back );
      if (back.id_backup.toString().includes(this.filtrosSearch.backup)) {
        // this.backupService.backups.splice(index, 1);
        filtroTemp.push(back);
      }
    });
    this.backupService.backups = filtroTemp;
  }*/
  // ----------------------------------------------------------------------

  private resetValuefiltroSearch(value) {
    switch (value) {
        case "backup":
          // this.backupService.backups = [];
          // this.backupService.backups = this.backupService.backups.concat(this.backupsModalTemp);
          this.filtrosSearch.backup = "";
          this.filtrosSearch.isbackup = false;
          break;
        case "usuario":
          this.filtrosSearch.usuario = "";
          this.filtrosSearch.isusuario = false;
          break;
        case "automatico":
          this.filtrosSearch.automatico = "-1";
          this.filtrosSearch.isautomatico = false;
          break;
        case "creacion":
          this.filtrosSearch.creacion = "";
          this.filtrosSearch.iscreacion = false;
          break;
        case "descarga":
          this.filtrosSearch.descarga = "";
          this.filtrosSearch.isdescarga = false;
          break;
        case "version":
          this.filtrosSearch.version = "";
          this.filtrosSearch.isversion = false;
          break;
    }
  }
  //-----------------------------------------------------------------------
  /*private verficarFiltrosActivados(): number {
    let bndTrue = 0;
    for (let filtrosSearchKey in this.filtrosSearch) {
      if (filtrosSearchKey.includes("is")) {
        if (this.filtrosSearch[filtrosSearchKey]) {
          bndTrue = bndTrue + 1;
          break;
        }
      }
    }
    return bndTrue;
  }*/
}
