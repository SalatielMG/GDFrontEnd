import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {BackupService} from "../../../../Servicios/backup/backup.service";

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {

  private email: string = "";
  private msj = "";
  //public usuarioMntSearch: FormGroup;

  constructor(private util: Utilerias, private backupService: BackupService) {
    this.buscarBackups();
  }

  ngOnInit() {
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

}
