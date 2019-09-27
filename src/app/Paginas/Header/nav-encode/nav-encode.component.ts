import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../../../Servicios/Usuario/usuario.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-nav-encode',
  templateUrl: './nav-encode.component.html',
  styleUrls: ['./nav-encode.component.css']
})
export class NavEncodeComponent implements OnInit {

  constructor(public userService: UsuarioService, private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
  }

  private eventLogo() {
    let ruta = this.router.url.split("/");
    console.log(ruta);
    switch (ruta[1]) {
      case "detalleRespaldo":
        this.router.navigate(["/backups"]);
        break;
      case "detalleUsuario":
        this.router.navigate(["/backups"]);
        break;
      default:
        this.router.navigate(["/home"]);
        break;
    }

  }

}
