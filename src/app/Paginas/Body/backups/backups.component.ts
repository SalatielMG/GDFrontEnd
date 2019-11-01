import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilerias } from '../../../Utilerias/Util';
import { BackupService } from '../../../Servicios/backup/backup.service';
import { UserService } from '../../../Servicios/user/user.service';
import {Backup} from "../../../Modelos/Backup/backup";
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {UsersBackupsMnt} from '../../../Modelos/users/usersBackupsMnt';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {

  private option: string = "";

  private isCreated = false;
  private isDownload = false;
  //private backupSelected: Backup;
  private backup: FormGroup;


  /*private pagina = 0;
  private filtrosSearch = new FiltrosSearchBackupsUser();
  private backupsFiltro: Backup[];
  private dataBackupSelected = [];
  private indexBackupSelected: number = 0;*/

  constructor(private userService: UserService, private backService: BackupService, private util: Utilerias, private route: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder) {

    //Consutar los bakups del usuario encontrado.
    // this.backupSelected.id_backup = 0;
    // this.buildForm();
    this.backService.resetearBackups();
    this.backService.userBackups.push(new UsersBackupsMnt());
    this.buscar();
  }
  onScroll () {
    if (!this.backService.isFilter() && !this.util.loadingMain) this.buscar();
  }
  private buscar() {
    this.util.loadingMain = true;
    if (this.backService.pagina == 0) {
      this.util.msjLoading = "Buscando Backups del usuario: " + this.userService.User.email;
      this.util.crearLoading().then(() => {
        this.backService.buscarBackupsUserId(this.userService.User.id_user, this.backService.pagina, "asc").subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.backService.buscarBackupsUserId(this.userService.User.id_user, this.backService.pagina, "asc").subscribe(result => {
        this.resultado(result);
      }, error => {
        this.util.msjErrorInterno(error, false);
      });
    }
  }
  private resultado(result) {
    if (this.backService.pagina == 0) {
      this.util.detenerLoading();
      this.util.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.backService.pagina += 1;
      this.backService.userBackups[this.backService.indexUser].backups = this.backService.userBackups[this.backService.indexUser].backups.concat(result.backups);
      this.util.QueryComplete.isComplete = false;
    } else {
      this.util.QueryComplete.isComplete = this.backService.pagina != 0;
    }
    this.util.loadingMain = false;
  }
  public actionBackup(option, backup: Backup, i = null) {
    this.option = option;
    this.backService.userBackups[this.backService.indexUser].indexBackupSelected = i;
    if (this.backService.isFilter()) {
      this.backService.userBackups[this.backService.indexUser].indexBackupSelected = <number> this.backService.userBackups[this.backService.indexUser].backups.indexOf(backup);
      this.backService.userBackups[this.backService.indexUser].indexBackupFilterSelected = i;
    }
    this.isCreated = backup.date_creation != "0000-00-00 00:00:00";
    this.isDownload = backup.date_download != "0000-00-00 00:00:00";
    this.buildForm(backup.id_backup, backup.automatic, (this.isCreated) ? new Date(backup.date_creation) : null, (this.isDownload) ? new Date(backup.date_download) : null, backup.created_in);
  }

  private buildForm(id_backup = 0, automatic = 0, date_creation = null, date_download = null, created_in = "") {
    this.backup = this.formBuilder.group({
      id_backup: [id_backup, Validators.required],
      automatic: [this.util.valueChecked(automatic), Validators.required],
      date_creation: [date_creation, (date_creation != null) ?  Validators.required : Validators.nullValidator],
      date_download: [date_download, (date_download != null) ?  Validators.required : Validators.nullValidator],
      created_in: [created_in, Validators.required]
    });
    if (this.isDelete()) this.disable(); else this.enable();
  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.backup.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }
  private disable() {
    for (let key in this.backup.getRawValue()) {
      this.backup.get(key).disable();
    }
    this.backup.disable();
  }
  private enable() {
    for (let key in this.backup.getRawValue()) {
      this.backup.get(key).enable();
    }
    this.backup.enable();
  }
  private isDelete(): boolean {
    return this.option == this.util.ELIMINAR;
  }
  private operacion() {
    // console.log(this.option, this.backup.value);
    switch (this.option) {
      case this.util.ACTUALIZAR:
        this.actualizarBackup();
        break;
      case this.util.ELIMINAR:
        this.eliminarBackup();
        break;
    }
  }
  private cerrarModal() {
    console.log("cerrando Modal :v");
    this.util.cerrarModal("#modalBackup").then(() => {
      this.option = "";
      this.backup = null;
    });
  }
  prueba() {
    console.log("clik modal :v");
  }

  private actualizarBackup(){
    console.log("Valor backup", this.backup.value);
    let dateTime_date_creation = this.util.formatDateTimeSQL( this.backup,"date_creation");
    let dateTime_date_download = this.util.formatDateTimeSQL( this.backup,"date_download");
    console.log("dateTime_date_creation", dateTime_date_creation);
    console.log("dateTime_date_download", dateTime_date_download);
    let newBackup = {
      id_backup : this.backup.value.id_backup,
      automatic : this.util.unValueChecked(this.backup.value.automatic),
      date_creation : dateTime_date_creation,
      date_download : dateTime_date_download,
      created_in : this.backup.value.created_in,
    };
    this.util.msjLoading = "Actualizando backup : " + this.backup.value.id_backup;
    this.util.crearLoading().then(() => {
      this.backService.actualizarBackup(newBackup).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          // this.util.cerrarModal("#modalBackup");
          if (!result.backup.error) {
            if (this.backService.isFilter()) {
              if (this.backService.userBackups[this.backService.indexUser].indexBackupSelected != -1) this.backService.userBackups[this.backService.indexUser].backups[this.backService.userBackups[this.backService.indexUser].indexBackupSelected] = result.backup.update;
              this.backService.userBackups[this.backService.indexUser].backupsFiltro[this.backService.userBackups[this.backService.indexUser].indexBackupFilterSelected] = result.backup.update;
            } else {
              this.backService.userBackups[this.backService.indexUser].backups[this.backService.userBackups[this.backService.indexUser].indexBackupSelected] = result.backup.update;
            }
          } else {
            this.util.msjToast(result.backup.msj, "", result.backup.error);
          }
          this.cerrarModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

  private eliminarBackup() {
      this.util.crearLoading().then(()=> {
        this.backService.eliminarBackup().subscribe(
          result => {
            this.util.detenerLoading();
            this.util.msjToast(result.msj, result.titulo, result.error);
            if (!result.error) {
              if (this.backService.isFilter()) {
                if (this.backService.userBackups[this.backService.indexUser].indexBackupSelected != -1) this.backService.userBackups[this.backService.indexUser].backups.splice(this.backService.userBackups[this.backService.indexUser].indexBackupSelected,1);
                this.backService.userBackups[this.backService.indexUser].backupsFiltro.splice(this.backService.userBackups[this.backService.indexUser].indexBackupFilterSelected, 1);
              } else {
                this.backService.userBackups[this.backService.indexUser].backups.splice(this.backService.userBackups[this.backService.indexUser].indexBackupSelected,1);
              }
              this.cerrarModal();
            }
            console.log(result);
          },
            error => {
          this.util.msjErrorInterno(error);
        });
      });
  }


  ngOnInit() {
    this.util.ready("left");
  }

}
