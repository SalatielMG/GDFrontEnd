import {Component, HostListener} from '@angular/core';
import {UsuarioService} from './Servicios/usuario/usuario.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Utilerias} from './Utilerias/Util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public userService: UsuarioService, public route: ActivatedRoute,
              public router: Router, public util: Utilerias){
    console.log(this.router.url);
    if (userService.activo()) {

      this.util.msjLoading = "Cargando sus datos. Porfavor espere";
      this.util.crearLoading().then(() => {
        this.userService.obtenerUsuario().subscribe(result => {
          this.util.detenerLoading();
          if (!result.error) {
            this.userService.usuarioCurrent = result.usuarios[0];
            this.userService.actualizarStorage();
            if (this.router.url == "/") {
               this.router.navigate(['/home']);
            }
          } else {
            this.util.msjToast(result.msj + ". Porfavor verifique otra vez su sesión o pongase en contacto con el superAdministrador", result.titulo, result.error);
            this.userService.isSesionOpen = false;
            this.userService.actualizarStorage();
            this.router.navigate(['/login']);
          }
        }, error => {
          this.util.msjErrorInterno(error);
          this.userService.isSesionOpen = false;
          this.userService.actualizarStorage();
          this.router.navigate(['/login'])
        });
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  title = 'Gastos Diarios';
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.util.onScroll = window.pageYOffset > 20;
    //console.log(window.pageYOffset);
  }
}
