import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {PermisoService} from '../../../../Servicios/permiso/permiso.service';
import {Permisos} from '../../../../Modelos/permisos/Permisos';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export class PermisosComponent implements OnInit {
  private option: string = "";

  constructor(private util: Utilerias, private permisoService: PermisoService, private usuarioService: UsuarioService) {
    this.permisoService.resetVariables();
    this.sarchPermisosGral();
  }

  ngOnInit() {
  }

  private sarchPermisosGral() {
    this.util.QueryComplete.isComplete = false;
    this.util.msjLoading = "Cargando permisos registrados";
    this.util.crearLoading().then(() => {
      this.permisoService.obtPermisosGral().subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
        if (!result.error) {
          this.util.QueryComplete.isComplete = true;
          this.permisoService.Permisos = result.permisos;
        }
        console.log("Resultado ConsultaPermisos", result);
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

  private actionPermiso(option, permiso = new Permisos(), index = null) {
    this.util.msjLoading = "Cargando usuarios";
    this.util.crearLoading().then(() => {
      this.usuarioService.obtUsuariosGral().subscribe(result => {
        if (result.error) {
          this.permisoService.UsuariosGal = result.usuarios;
          this.option = option;
          // Pendiente
        } else {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

}
