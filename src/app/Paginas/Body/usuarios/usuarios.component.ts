import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../Utilerias/Util';
import {UsuarioService} from '../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(private util: Utilerias, private usuarioService: UsuarioService) {
    this.usuarioService.resetVariables();
    this.obtUsuarios();
  }

  ngOnInit() {
  }
  private obtUsuarios() {
    this.util.msjLoading = "Buscand usuarios registrados en la Base de Datos";
    this.util.crearLoading().then(() => {
      this.usuarioService.obtUsersGral().subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.usuarioService.Usuarios = result.usuarios;
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

}
