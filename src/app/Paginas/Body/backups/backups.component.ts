import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilerias } from '../../../Utilerias/Util';
import { BackupService } from '../../../Servicios/backup/backup.service';
import { UserService } from '../../../Servicios/user/user.service';
import {Backup} from "../../../Modelos/Backup/backup";
import {FiltrosSearchBackupsUser} from "../../../Modelos/Backup/filtros-search-backups-user"
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {

  private pagina = 0;
  private filtrosSearch = new FiltrosSearchBackupsUser();
  private backupsFiltro: Backup[];
  private isCreated = false;
  private isDownload = false;
  //private backupSelected: Backup;
  private backup: FormGroup;
  private dataBackupSelected = [];
  private indexBackupSelected: number = 0;

  constructor(private userService: UserService, private backService: BackupService, private util: Utilerias, private route: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder) {

    //Consutar los bakups del usuario encontrado.
    // this.backupSelected.id_backup = 0;
    this.construirFormulario();
    this.resetearVariables();
    this.buscar();
  }
  onScroll () {
    if (!this.isFilter()) this.buscar();
  }
  private resetearVariables() {
    this.pagina = 0;
    this.backService.backups = [];
  }
  private buscar() {
    this.util.loadingMain = true;
    if (this.pagina == 0) {
      this.util.msjLoading = "Buscando Backups del usuario: " + this.userService.User.email;
      this.util.crearLoading().then(() => {
        this.backService.buscarBackupsUserId(this.userService.User.id_user, this.pagina, "desc").subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.backService.buscarBackupsUserId(this.userService.User.id_user, this.pagina, "desc").subscribe(result => {
        this.resultado(result, false);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result, bnd = true) {
    if (bnd) {
      this.util.detenerLoading();
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.util.QueryComplete.isComplete = false;
      this.pagina += 1;
      this.backService.backups = this.backService.backups.concat(result.backups);
    } else {
      if (this.pagina == 0) {
        this.util.QueryComplete.isComplete = false;
      } else {
        this.util.QueryComplete.isComplete = true;
      }
    }
    this.util.loadingMain = false;
  }
  public eliminar(dataBackup, back) {
    this.dataBackupSelected = dataBackup;
    this.indexBackupSelected = this.dataBackupSelected[0];
    //let bnd = this.isFilter();
    if (this.dataBackupSelected[2]) {
      this.indexBackupSelected = <number>this.backService.backups.indexOf(back);
    }
    let opcion = confirm("¿ Esta seguro de eliminar el Respaldo num: " + (this.indexBackupSelected + 1) + ", Id_Backup: " + back.id_backup + " ?");
    if (opcion) {
      // On Delete On Cascada.
      this.util.crearLoading().then(()=> {
        this.backService.eliminarBackup(back.id_backup).subscribe(
          result => {
            this.util.detenerLoading();
            this.util.msjToast(result.msj, result.titulo, result.error);
            if (!result.error) {
              if (this.dataBackupSelected[2]) {
                if (this.indexBackupSelected != -1) this.backService.backups.splice((this.indexBackupSelected),1);
                this.backupsFiltro.splice(this.dataBackupSelected[1], 1);
              } else {
                this.backService.backups.splice(this.indexBackupSelected,1);
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
  private abrirModalActualizar(dataBackup, back: Backup) {
    // this.backupSelected = back;
    this.dataBackupSelected = dataBackup;
    this.indexBackupSelected = this.dataBackupSelected[0];
    //let bnd = this.isFilter();
    if (this.dataBackupSelected[2]) {
      this.indexBackupSelected = <number>this.backService.backups.indexOf(back);
    }
    console.log("backup seleccionado", back);
    this.isCreated = back.date_creation != "0000-00-00 00:00:00";
    this.isDownload = back.date_download != "0000-00-00 00:00:00";
    this.construirFormulario(back.id_backup, back.automatic, (this.isCreated) ? new Date(back.date_creation): null, (this.isDownload) ? new Date(back.date_download) : null, back.created_in);

  }
  private construirFormulario(id_backup = 0, automatic = 0, date_creation = null, date_download = null, created_in = "") {
    this.backup = this.formBuilder.group({
      id_backup: [id_backup, Validators.required],
      automatic: [automatic, Validators.required],
      date_creation: [date_creation, (date_creation != null) ?  Validators.required : Validators.nullValidator],
      date_download: [date_download, (date_download != null) ?  Validators.required : Validators.nullValidator],
      created_in: [created_in, Validators.required]
    });
  }
  private formatDateTimeSQL(key) {
    let dateTime = "";
    if (this.backup.value[key] != null) {
      this.backup.value[key].toLocaleDateString().split("/").reverse().forEach((d) => {
        dateTime = dateTime + d + "-";
      });
      dateTime = (dateTime.substring(0, dateTime.length - 1)) + " " + this.backup.value[key].toLocaleTimeString();
    } else {
      dateTime = "0000-00-00 00:00:00";
    }
    return dateTime;
  }

  public actualizarBackup(){
    /*console.log("Valor backup", this.backup.value);*/
    let dateTime_date_creation = this.formatDateTimeSQL("date_creation");
    let dateTime_date_download = this.formatDateTimeSQL("date_download");
    /*console.log("dateTime_date_creation", dateTime_date_creation);
    console.log("dateTime_date_download", dateTime_date_download);*/
    let newBackup = {
      id_backup : this.backup.value.id_backup,
      automatic : this.backup.value.automatic,
      date_creation : dateTime_date_creation,
      date_download : dateTime_date_download,
      created_in : this.backup.value.created_in,
    };
    this.util.msjLoading = "Actualizando backup : " + this.backup.value.id_backup;
    this.util.crearLoading().then(() => {
      this.backService.actualizarBackup(newBackup).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.util.cerrarModal("#exampleModalCenter");
          if (!result.backup.error) {
            if (this.dataBackupSelected[2]) {
              if (this.indexBackupSelected != -1) this.backService.backups[this.indexBackupSelected] = result.backup.update;
              this.backupsFiltro[this.dataBackupSelected[1]] = result.backup.update;
            } else {
              this.backService.backups[this.indexBackupSelected] = result.backup.update;
            }
          } else {
            this.util.msjToast(result.backup.msj, "", result.backup.error);
          }
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

  ngOnInit() {
    this.util.ready("left");
  }

  // --------------------------------------------------------------------------------------------
  // Filtro Backups User
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
  private resetFilterisActive() {
    if (!this.isFilter()) {
      this.backupsFiltro = [];
      this.backupsFiltro =  this.backupsFiltro.concat(this.backService.backups);
    }
  }
  private proccessFilter() {
    let temp = [];
    this.backService.backups.forEach((back) => {
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
  private isFilter(): boolean {
    for (let key in this.filtrosSearch) {
      if (this.filtrosSearch[key].isFilter) return true;
    }
    return false;
  }
  // --------------------------------------------------------------------------------------------


}
