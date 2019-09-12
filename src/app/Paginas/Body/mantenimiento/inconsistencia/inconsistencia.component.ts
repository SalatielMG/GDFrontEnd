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

  constructor(private backupService: BackupService, private util: Utilerias,  private route: ActivatedRoute,
              private router: Router) {
    this.search();
  }
  ngOnInit() {
  }
  private prueba(event) {
    let indices = [];
    console.log('Valor event:= ', event.target.selectedOptions);
    for (let option of event.target.selectedOptions) {
      console.log(option.value);
      let key = option.value.split(":");
      indices.push(key);
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
        console.log("this.backupService.backups", this.backupService.backups);
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
    this.backupService.corregirInconsistencia(tabla).subscribe(result => {
      this.router.navigate(["/mantenimiento/inconsistenciaMnt"]).then(()=> {
        this.router.navigate([tabla], {relativeTo: this.route});
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
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
      this.backupTemp.push(this.backupService.backups[index].id_backup);
      this.backupIndexTemp.push(index);
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
  public cerrar() {
    //----------------------------------------------------------------------------------
    console.log("//--------------------------------Cerrando modal------------------------------//");
    console.log("this.backupIndexTemp", this.backupIndexTemp);
    console.log("this.backupIndex", this.backupIndex);
    if (this.backupIndexTemp.length > this.backupIndex.length) { //--- Deselecciona ---//
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
    console.log("//--------------------------------Abreiendo modal------------------------------//");
    console.log("this.backupIndexTemp", this.backupIndexTemp);
    console.log("this.backupIndex", this.backupIndex);
    console.log("this.backup", this.backup);
    console.log("this.backupTemp", this.backupTemp);

    //----------------------------------------------------------------------------------

  }
}
