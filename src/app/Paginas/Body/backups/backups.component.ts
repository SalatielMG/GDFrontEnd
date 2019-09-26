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
  private msj;
  private pagina = 0;
  private filtrosSearch = new FiltrosSearchBackupsUser();
  private backupsFiltro: Backup[];
  //private backupSelected: Backup;
  private backup: FormGroup;

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
      this.msj = "Buscando Backups del usuario: " + this.userService.User.email;
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
      this.msj = result.msj;
      this.util.msjToast(result.msj, result.titulo, result.error);
    }
    if (!result.error) {
      this.pagina += 1;
      this.backService.backups = this.backService.backups.concat(result.backups);
    }
    this.util.loadingMain = false;
  }
  public eliminar(numBack, back) {
    let index = numBack[0];
    let bnd = this.isFilter();
    if (bnd) {
      let index = <number>this.backService.backups.indexOf(back);
    }
    let opcion = confirm("¿ Esta seguro de eliminar el Respaldo num: " + ((bnd) ? index: index + 1) + ", Backup: " + back.id_backup + " ?");
    if (opcion) {
      // On Delete On Cascada.
      this.util.crearLoading().then(()=> {
        this.backService.eliminarBackup(back.id_backup).subscribe(
          result => {
            this.util.detenerLoading();
            this.util.msjToast(result.msj, result.titulo, result.error);
            if (!result.error) {
              if (bnd) {
                if (index != -1) this.backService.backups.splice((index -1),1);
                this.backupsFiltro.splice(numBack[1], 1);
              } else {
                this.backService.backups.splice(index,1);
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
  private abrirModalActualizar(back: Backup) {
    // this.backupSelected = back;
    console.log("backup seleccionado", back);
    this.construirFormulario(back.id_backup, back.automatic, back.date_creation, back.date_download, back.created_in);
  }
  private construirFormulario(id_backup = 0, automatic = 0, date_creation = "", date_download = "", created_in = "") {
    this.backup = this.formBuilder.group({
      id_backup: [id_backup, Validators.required],
      automatic: [automatic, Validators.required],
      date_creation: [date_creation, Validators.required],
      date_download: [date_download, Validators.required],
      created_in: [created_in, Validators.required]
    });
  }
  private actualizarBackup(){
    console.log(this.backup.value);
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
