import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {PermisoService} from '../../../../Servicios/permiso/permiso.service';
import {Permisos} from '../../../../Modelos/permisos/Permisos';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export class PermisosComponent implements OnInit {

  private option: string = "";
  private PermisoSelected = new Permisos();
  private UsersSelected = [];
  private Permiso: FormGroup = null;


  constructor(private util: Utilerias, private permisoService: PermisoService, private usuarioService: UsuarioService, private formBuilder: FormBuilder) {
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
        if (!result.error) {
          this.permisoService.UsuariosGal = result.usuarios;
          this.option = option;
          this.buildForm(permiso);
          if (this.option != this.util.AGREGAR) {
            this.PermisoSelected = permiso;
            this.permisoService.indexPermisoSelected = index;
            if (this.option == this.util.ACTUALIZAR) {
              for (let user of permiso.usuarios) {
                this.UsersSelected.push(user.id);
              }
            }
          }
          setTimeout(() => {
            this.util.detenerLoading();
            this.util.abrirModal("#modalPermiso");
          }, this.util.timeOutMilliseconds);
        } else {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private buildForm(permiso: Permisos) {
    this.Permiso = this.formBuilder.group({
      permiso: [permiso.permiso, [Validators.required, Validators.maxLength(50)]],
      descripcion: [permiso.descripcion, [Validators.maxLength(255)]],
    });
    if (this.util.isDelete(this.option)) this.disable();
  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.Permiso.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }

  private disable() {
    for (let key in this.Permiso.getRawValue()) {
      this.Permiso.get(key).disable();
    }
    this.Permiso.disable();
  }
  private closeModal() {
    this.util.cerrarModal("#modalPermiso").then(() => {
      this.option = "";
      this.Permiso = null;
    });
  }
  private operation() {
    switch (this.option) {
      case this.util.AGREGAR:
        this.agregarPermiso();
        break;
      case this.util.ACTUALIZAR:
        this.actualizarPermiso();
        break;
      case this.util.ELIMINAR:
        this.eliminarPermiso();
        break;
    }
  }
  private agregarPermiso() {
    this.util.msjLoading = "Agregando nuevo Permiso " + this.Permiso.value.permiso;
    this.util.crearLoading().then(() => {
      this.permisoService.agregarPermiso(this.Permiso.value, this.UsersSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.permiso.error) {
            this.permisoService.Permisos.push(result.permiso.new);
          } else
            this.util.msjToast(result.permiso.msj, this.util.errorRefreshListTable, result.permiso.error);
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private actualizarPermiso() {
    this.util.msjLoading = "Actualizando Permiso " + this.PermisoSelected.permiso;
    this.util.crearLoading().then(() => {
      this.permisoService.actualizarPermiso(this.Permiso.value, this.PermisoSelected, this.UsersSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.permiso.error) {
            this.permisoService.Permisos[this.permisoService.indexPermisoSelected] = result.permiso.update;
          } else
            this.util.msjToast(result.permiso.msj, this.util.errorRefreshListTable, result.permiso.error);
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private eliminarPermiso() {
    this.util.msjLoading = "Eliminando Permiso " + this.PermisoSelected.permiso;
    this.util.crearLoading().then(() => {
      this.permisoService.eliminarPermiso(this.PermisoSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          this.permisoService.Permisos.splice(this.permisoService.indexPermisoSelected, 1);
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
}
