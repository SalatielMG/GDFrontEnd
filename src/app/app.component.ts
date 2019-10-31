import {Component, HostListener} from '@angular/core';
import {UsuarioService} from './Servicios/Usuario/usuario.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Utilerias} from './Utilerias/Util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public userService: UsuarioService, private route: ActivatedRoute,
              private router: Router, private util: Utilerias){
    if (userService.activo()) {
      this.router.navigate(['/home'])
    } else {
      this.router.navigate(['/login'])

    }
  }
  title = 'Gastos Diarios';
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.util.onScroll = window.pageYOffset > 20;
    console.log(window.pageYOffset);
  }
}
