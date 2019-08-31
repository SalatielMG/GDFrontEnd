import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilerias } from '../../../Utilerias/Util';
import { BackupService } from '../../../Servicios/backup/backup.service';
import { UserService } from '../../../Servicios/user/user.service';


@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {
  public msj;
  constructor(private userService: UserService, private backService: BackupService, private util: Utilerias, private route: ActivatedRoute,
              private router: Router) {
    /*this.route.paramMap.subscribe(params => {
      /*this.user.id = params.get("id");
      this.user.email = params.get("email");
    });
    this.msj = "";
      this.user.email = params.get("user");
    this.backups = JSON.parse(params.get('backups'));
      console.log('User recibido',this.user);
      console.log('Backups backups',this.backups);
    });*/

    //Consutar los bakups del usuario encontrado.
    this.msj = "Buscando Backups del usuario: " + this.userService.User.email;
    this.util.crearLoading().then(() => {
      this.backService.buscarBackups(this.userService.User.id_user).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.backService.backups = result.backups;
        }
      }, error => {
        this.util.detenerLoading();
        this.util.msjErrorInterno(error);
      });
    });
  }
  public eliminar(numBack, idBack) {
    let opcion = confirm("Esta seguro de eliminar el Respaldo num: " + (numBack + 1) + ", Backup: " + idBack + "?");
    if (opcion) {
      // On Delete On Cascada.
      this.util.crearLoading().then(()=> {
        this.backService.eliminarBackup(idBack).subscribe(
          result => {
            this.util.detenerLoading();
            this.util.msjToast(result.msj, result.titulo, result.error);
            if (!result.error) {
              // Backuo Eliminado correctamente.
              this.backService.backups.splice(numBack,1);
            }
            console.log(result);
          },
            error => {
          this.util.detenerLoading();
          this.util.msjErrorInterno(error);
        });
      });
    }
    console.log('Opcion Elegida', opcion);
  }

  ngOnInit() {
  }
  public prueba()  {

  }
}
