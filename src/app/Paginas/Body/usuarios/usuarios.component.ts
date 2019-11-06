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
  private UsuarioSelected = new Usuarios();
  private PermisosSelected = {
    value: [],
    valueAnt: []
  };
  private Usuario: FormGroup = null;
  private isExpandedPermisoCard: boolean = false;
  private isUpdatePermisosSelectUsuario: boolean = false;

  @ViewChild("cntPermisos", {read: "", static: false}) cntPermisos = ElementRef;

  constructor(private util: Utilerias, private usuarioService: UsuarioService, private permisoService: PermisoService, private formBuilder: FormBuilder, private renderer: Renderer2) {
    this.usuarioService.resetVariables();
    this.obtUsuarios();
  }

  ngOnInit() {
  }

  private obtUsuarios() {
    this.util.msjLoading = "Buscando usuarios registrados en la Base de Datos";
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
  private resetPermisoSelected() {
    this.PermisosSelected.value = [];
    this.PermisosSelected.valueAnt = [];
  }
  private obtPermisosGral(isExpanded = true) {
    this.util.msjLoading = "Cargando permisos";
    this.util.crearLoading().then(() => {
      this.permisoService.obtPermisosGral().subscribe(result => {
        this.util.detenerLoading();
        if (!result.error) {
          this.usuarioService.PermisosGral = result.permisos;
          this.isExpandedPermisoCard = true;
          if (this.option != this.util.AGREGAR) {
            for (let permiso of this.UsuarioSelected.permisos) {
              this.PermisosSelected.valueAnt.push(permiso.id);
              this.usuarioService.PermisosGral.forEach(p => {
                if (p.id == permiso.id) {
                  p.checked = true;
                }
              });
            }
            this.PermisosSelected.value = this.PermisosSelected.value.concat(this.PermisosSelected.valueAnt);
          }
          if (isExpanded) this.verifyExpandCardUser();
          else this.util.abrirModal("#modalPermisos_Usuario");
        } else {
          this.util.msjToast(result.msj, result.titulo, result.error);
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private cargarPermisosGral() {
    this.isExpandedPermisoCard = !this.isExpandedPermisoCard;
    this.resetPermisoSelected();
    if (this.isExpandedPermisoCard) {
      this.obtPermisosGral();
    } else this.verifyExpandCardUser();
  }
  private actionUsuario(option, usuario = new Usuarios(), index= null) {
    this.option = option;
    this.buildForm(usuario);
    this.resetPermisoSelected();
    this.isExpandedPermisoCard = false;
    if (this.option != this.util.AGREGAR) {
      this.UsuarioSelected = usuario;
      this.usuarioService.indexUsuarioSelected = index;
      if (this.util.isDelete(this.option)) {
        this.cargarPermisosGral();
      }
    }
  }
  private actionPermisosUsuario(option, usuario: Usuarios, index) {
    this.isExpandedPermisoCard = false;
    this.option = option;
    this.resetPermisoSelected();
    if (this.option == this.util.CONSULTA) {
      this.UsuarioSelected = usuario;
      this.usuarioService.indexUsuarioSelected = index;
      this.obtPermisosGral(false);
    }
  }
  // ---------------------------- CheckPermisos
  private checkPermiso(index) {
    if (this.util.isDelete(this.option) || (this.option == this.util.CONSULTA && !this.isUpdatePermisosSelectUsuario)) return;
    if (this.usuarioService.PermisosGral[index].checked) { // Uncheck =>
      let posInArrayUserSelected = this.PermisosSelected.value.indexOf(this.usuarioService.PermisosGral[index].id);
      if (posInArrayUserSelected != -1) {
        this.PermisosSelected.value.splice(posInArrayUserSelected, 1);
      }
    } else { // Uncheck =>
      if (!this.PermisosSelected.value.includes(this.usuarioService.PermisosGral[index].id)) {
        this.PermisosSelected.value.push(this.usuarioService.PermisosGral[index].id);
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
      id: [usuario.id, [Validators.required]],
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
  private actualizarPermisosUsuario() {

  }
}
