import { Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../Servicios/user/user.service';
import { BackupService } from '../../../Servicios/backup/backup.service';
import { Chart } from 'chart.js';
import { Utilerias } from '../../../Utilerias/Util';
import {UsersBackupsMnt} from '../../../Modelos/users/usersBackupsMnt';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent {
  constructor(public route: ActivatedRoute,
              public router: Router, public userService: UserService, public backService: BackupService, public util: Utilerias) {
    console.log("this.backService.userBackups", this.backService.userBackups);
    console.log("this.backService.userBackups.length",this.backService.userBackups.length);
    console.log("this.userService.User", this.userService.User);
    console.log("this.backService.indexUser", this.backService.indexUser);

    if (this.backService.userBackups.length == 0) {
      this.util.msjLoading = "Cargando datos del usuario: " + this.userService.User.email + ". Porfavor espere";
      this.util.crearLoading().then(() => {
        this.backService.buscarBackupsUserId(this.userService.User.id_user, '-1' ,'asc').subscribe(result => {
          this.util.detenerLoading();
          if (!result.error) {
            this.backService.userBackups.push(new UsersBackupsMnt());
            this.backService.userBackups[this.backService.indexUser].backups = result.backups;
            this.router.navigate(['gastos'], {relativeTo: this.route});
          } else {
            this.router.navigate(["/home"]);
            this.util.msjToast("Ourrio un error al obtener los datos del usuario: " + this.userService.User.email + ". Porfavor repita el proceso desde otra ruta", "¡ Error !", true);
          }
        }, error => {
          this.util.msjToast("Ourrio un error al obtener los datos del usuario: " + this.userService.User.email + ". Porfavor repita el proceso desde otra ruta", "¡ Error !", true);
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.router.navigate(['gastos'], {relativeTo: this.route});
    }
  }

  public paginaBackup(url){
    this.router.navigate(url);
  }


}
