import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../../../Servicios/usuario/usuario.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrenciesService} from '../../../Servicios/currencies/currencies.service';
import {Utilerias} from '../../../Utilerias/Util';

@Component({
  selector: 'app-nav-encode',
  templateUrl: './nav-encode.component.html',
  styleUrls: ['./nav-encode.component.css']
})
export class NavEncodeComponent implements OnInit {

  constructor(public userService: UsuarioService, public route: ActivatedRoute,
              public router: Router, public currencyService: CurrenciesService, public util: Utilerias) { }

  ngOnInit() {
  }
  public urlAvatar() {
    return this.userService.url + "util/avatar/" + this.userService.usuarioCurrent.imagen;
  }
  public eventLogo() {
    let ruta = this.router.url.split("/");
    if (ruta.length > 3) {
      switch (ruta[3]) {
        case "detalleRespaldo":
          this.router.navigate(["home/backups"]);
          break;
        case "detalleUsuario":
          this.router.navigate(["home/backups"]);
          break;
        default:
          this.router.navigate(["/home"]);
          break;
      }
    } else {
      this.router.navigate(["/home"]);

    }

  }

  public insertCurrencies() {
    this.util.msjLoading = "Insertando datos en la tabla table_currencies";
    this.util.crearLoading().then(() => {
      this.currencyService.insertCurrencies().subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

  public logout(){
    this.userService.logout();
    this.util.cerrarModal("#modalConfirmLogout");
  }

}
