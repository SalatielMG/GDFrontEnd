import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../../../Servicios/Usuario/usuario.service';

@Component({
  selector: 'app-nav-encode',
  templateUrl: './nav-encode.component.html',
  styleUrls: ['./nav-encode.component.css']
})
export class NavEncodeComponent implements OnInit {

  constructor(public userService: UsuarioService) { }

  ngOnInit() {
  }

}
