import { Component } from '@angular/core';
import {UsuarioService} from './Servicios/Usuario/usuario.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public userService: UsuarioService, private route: ActivatedRoute,
              private router: Router){
    if (userService.activo()) {
      this.router.navigate(['/home'])
    } else {
      this.router.navigate(['/login'])

    }
  }
  title = 'Gastos Diarios';
}
