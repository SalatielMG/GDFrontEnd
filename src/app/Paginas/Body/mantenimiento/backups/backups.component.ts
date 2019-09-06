import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {BackupService} from "../../../../Servicios/backup/backup.service";
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {CampoNumerico} from '../../../../Utilerias/validacionCampoNumerico';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {

  private email: string = "";
  private msj = "";
  public faArrowCircleDown = faArrowDown;
  public faArrowCircleUp = faArrowUp;

  //public usuarioMntSearch: FormGroup;

  constructor(private util: Utilerias, private backupService: BackupService) {
    this.buscarBackups();
  }

  ngOnInit() {
    new CampoNumerico("#rangoBackups");
    //this.construirFormulario();
  }
  /*public construirFormulario() {
    this.usuarioMntSearch = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }*/

  public search() {
    console.log("email user:", this.email);
    if (this.email.length == 0) {
      this.util.emailUserMntBackup = "Generales";
      this.buscarBackups();
    } else {
      if ((this.util.regex_email).exec(this.email)) {
        this.util.emailUserMntBackup = this.email;
        console.log("this.util.emailUserMntBackup ", this.util.emailUserMntBackup );
        this.buscarBackups();

      } else {
        this.util.msjToast("Porfavor ingrese un correo valido", "Email no Valido", true);
      }
    }

  }
  private buscarBackups() {
    this.msj = "Buscando backups " + ((this.util.emailUserMntBackup == "Generales") ? this.util.emailUserMntBackup: "del usuario : " + this.util.emailUserMntBackup);
    this.util.crearLoading().then(() => {
      this.backupService.buscarBackupsUserCantidad(this.util.emailUserMntBackup, 10).subscribe(result => {
        this.util.detenerLoading();
        this.msj = result.msj;
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.backupService.mntBackups = result.backups;
        }
        console.log(result);
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }

  public verficarExpansion(indice, idUser, email) {

    if (this.backupService.mntBackups[indice].collapsed == 0) { // Expandir
      this.msj = "Cargando backups del usuario: " + email;
      this.util.crearLoading().then(() => {
        this.backupService.buscarBackups(idUser).subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          this.backupService.mntBackups[indice].msj = result.msj;
          this.backupService.mntBackups[indice].cantRep = result.backups.length;
          console.log(result.backups);

          if (!result.error){
            this.backupService.mntBackups[indice].backups = result.backups;
            this.backupService.mntBackups[indice].collapsed  = 1;
          }
        }, error =>  {
          this.util.detenerLoading();
          this.util.msjErrorInterno(error);
        });
      });

      //return true;
    } else { // Minimizar
      this.backupService.mntBackups[indice].collapsed  = 0;

      //return false;
    }
    console.log(this.backupService.mntBackups[indice].collapsed );
  }
  public encabezado(i){
    return "#" + i;
  }

}
