import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Utilerias} from '../../../Utilerias/Util';
import {UsuarioService} from '../../../Servicios/usuario/usuario.service';
import {URL} from './../../../Utilerias/URL';
import {Usuarios} from '../../../Modelos/usuarios/usuarios';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PermisoService} from '../../../Servicios/permiso/permiso.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  private option: string = "";
  private url = URL;
  private UsuarioSelected = new Usuarios();
  private PermisosSelected = [];
  private Usuario: FormGroup = null;
  private isExpandedPermisoCard: boolean = false;

  @ViewChild("cntPermisos", {read: "", static: false}) cntPermisos = ElementRef;

  constructor(private util: Utilerias, private usuarioService: UsuarioService, private permisoService: PermisoService, private formBuilder: FormBuilder, private renderer: Renderer2) {
    this.usuarioService.resetVariables();
    this.obtUsuarios();
  }

  ngOnInit() {
  }

  private obtUsuarios() {
    this.util.msjLoading = "Buscand usuarios registrados en la Base de Datos";
    this.util.crearLoading().then(() => {
      this.usuarioService.obtUsuariosGral(this.usuarioService.id, "1").subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.usuarioService.Usuarios = result.usuarios;
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }

  private actionUsuario(option, usuario = new Usuarios(), index= null) {
    this.util.msjLoading = "Cargando permisos";
    this.util.crearLoading().then(() => {
      this.permisoService.obtPermisosGral().subscribe(result => {
        if (!result.error) {
          this.usuarioService.PermisosGral = result.permisos;
          this.option = option;
          this.buildForm(usuario);
          this.PermisosSelected = [];
          if (this.option != this.util.AGREGAR) {
            this.isExpandedPermisoCard = true;
            this.UsuarioSelected = usuario;
            this.usuarioService.indexUsuarioSelected = index;
            for (let permiso of usuario.permisos) {
              this.PermisosSelected.push(permiso.permiso);
              this.usuarioService.PermisosGral.forEach(p => {
                if (p.permiso == permiso.permiso) {
                  p.checked = true;
                }
              });
            }
          } else {
            this.isExpandedPermisoCard = false;
          }
          setTimeout(() => {
            this.util.detenerLoading();
            this.util.abrirModal("#modalUsuario");
            this.verifyExpandCardUser();
          }, this.util.timeOutMilliseconds);
        } else {
          this.util.detenerLoading() ;
          this.util.msjToast(result.msj, result.titulo, result.error);
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  // ---------------------------- CheckPermisos
  private checkPermiso(index) {
    if (this.util.isDelete(this.option)) return;
    if (this.usuarioService.PermisosGral[index].checked) { // Uncheck =>
      let posInArrayUserSelected = this.PermisosSelected.indexOf(this.usuarioService.PermisosGral[index].permiso);
      if (posInArrayUserSelected != -1) {
        this.PermisosSelected.splice(posInArrayUserSelected, 1);
      }
    } else { // Uncheck =>
      if (!this.PermisosSelected.includes(this.usuarioService.PermisosGral[index].permiso)) {
        this.PermisosSelected.push(this.usuarioService.PermisosGral[index].permiso);
      }
    }
    this.usuarioService.PermisosGral[index].checked = !this.usuarioService.PermisosGral[index].checked;
    console.log(this.PermisosSelected);
  }
  // ---------------------------- CheckPermisos
  private verifyExpandCardUser() {
    console.log(this.cntPermisos);
    let H = (this.util.obtisFullHDDisplay()) ? 300: 220;
    if (this.isExpandedPermisoCard) {
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "transition", "height 500ms, max-height 500ms");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "height", H + "px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "max-height", H + "px");
    } else {
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "transition", "height 500ms, max-height 500ms");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "height", "0px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "max-height", "0px");
    }
  }
  private buildForm(usuario: Usuarios) {
    this.Usuario = this.formBuilder.group({
      email: [usuario.email, [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: [usuario.password, [Validators.required]],
      tipo: [usuario.tipo, [Validators.required]],
      cargo: [usuario.cargo, [Validators.required]],
      //imagen: [usuario.imagen, ],
    });
    if (this.util.isDelete(this.option)) this.disable();
  }
  private getError(controlName: string): string {
    let error = '';
    const control = this.Usuario.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }

  private disable() {
    for (let key in this.Usuario.getRawValue()) {
      this.Usuario.get(key).disable();
    }
    this.Usuario.disable();
  }
  private closeModal() {
    this.util.cerrarModal("#modalUsuario").then(() => {
      this.option = "";
      this.Usuario = null;
    });
  }
  private operation() {
    switch (this.option) {
      case this.util.AGREGAR:
        this.agregarUsuario();
        break;
      case this.util.ACTUALIZAR:
        this.actualizarUsuario();
        break;
      case this.util.ELIMINAR:
        this.eliminarUsuario();
        break;
    }
    console.log(this.Usuario.value);
    console.log(this.PermisosSelected);
  }
  private agregarUsuario() {

  }
  private actualizarUsuario() {

  }
  private eliminarUsuario() {

  }

}
