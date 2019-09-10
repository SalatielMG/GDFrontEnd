import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilerias } from '../../../Utilerias/Util';
import { BackupService } from '../../../Servicios/backup/backup.service';
import { UserService } from '../../../Servicios/user/user.service';
import { faArrowUp} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {
  public msj;
  public faArrowUp = faArrowUp;
  private pagina = 0;

  constructor(private userService: UserService, private backService: BackupService, private util: Utilerias, private route: ActivatedRoute,
              private router: Router) {

    //Consutar los bakups del usuario encontrado.
    this.resetearVariables();
    this.buscar();
  }
  onScroll () {
    console.log('scrolled!!');
    this.buscar();
  }
  private resetearVariables() {
    this.pagina = 0;
    this.backService.backups = [];
  }
  private buscar() {
    this.util.loading = true;
    if (this.pagina == 0) {
      this.msj = "Buscando Backups del usuario: " + this.userService.User.email;
      this.util.crearLoading().then(() => {
        this.backService.buscarBackups(this.userService.User.id_user, this.pagina, "desc").subscribe(result => {
          this.resultado(result);
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    } else {
      this.backService.buscarBackups(this.userService.User.id_user, this.pagina, "desc").subscribe(result => {
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
    this.util.loading = false;
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
          this.util.msjErrorInterno(error);
        });
      });
    }
    console.log('Opcion Elegida', opcion);
  }

  ngOnInit() {
    this.util.ready("left");
  }
}
