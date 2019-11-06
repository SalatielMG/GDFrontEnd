import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Utilerias} from '../../../Utilerias/Util';
import {UsuarioService} from '../../../Servicios/usuario/usuario.service';
import {Usuarios} from '../../../Modelos/usuarios/usuarios';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PermisoService} from '../../../Servicios/permiso/permiso.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  private rutaImg: any;
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
      this.usuarioService.obtUsuariosGral(this.usuarioService.id).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;
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
      this.permisoService.obtPermisosGral("0").subscribe(result => {
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
    this.isUpdatePermisosSelectUsuario = false;
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
      password: [usuario.password, [(this.option == this.util.AGREGAR) ? Validators.required : Validators.nullValidator]],
      tipo: [usuario.tipo, [Validators.required]],
      cargo: [usuario.cargo, [Validators.required]],
      imagen: [""],
      //imagen: [usuario.imagen, ],
    });
    if (this.option == this.util.ACTUALIZAR) {
      this.Usuario.removeControl("password");
    }
    if (this.util.isDelete(this.option)) {
      this.disable();
      this.Usuario.removeControl("password");
    }
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
    this.util.msjLoading = "Agregando nuevo Usuario: " + this.Usuario.value.email;
    this.util.crearLoading().then(() => {
      this.usuarioService.agregarUsuario(this.Usuario.value, this.PermisosSelected.value).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;

        if (!result.error) {
          if (!result.usuario.error) {
            this.usuarioService.Usuarios.push(result.usuario.new);
          } else {
            this.util.msjToast(result.usuario.msj, this.util.errorRefreshListTable, result.usuario.error);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private actualizarUsuario() {
    console.log("this.PermisosSelected", this.PermisosSelected);
    let isChangePermisos = { isChangePermisos: false, };
    if (!this.util.compare(this.PermisosSelected.value, this.PermisosSelected.valueAnt)) {
      isChangePermisos.isChangePermisos = true;
      isChangePermisos["permisosSelected"] = this.PermisosSelected.value;
    }
    console.log("isChangePermisos", isChangePermisos);

    this.util.msjLoading = "Actualizando Usuario: " + this.Usuario.value.email;
    this.util.crearLoading().then(() => {
      this.usuarioService.actualizarUsuario(this.Usuario.value, this.UsuarioSelected, isChangePermisos).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;

        if (!result.error) {
          if (!result.usuario.error) {
            this.usuarioService.Usuarios[this.usuarioService.indexUsuarioSelected] = result.usuario.update;
          } else {
            this.util.msjToast(result.usuario.msj, this.util.errorRefreshListTable, result.usuario.error);
          }
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });

  }
  private eliminarUsuario() {
    this.util.msjLoading = "Eliiminando Usuario: " + this.Usuario.value.email;
    this.util.crearLoading().then(() => {
      this.usuarioService.eliminarUsuario(this.UsuarioSelected).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        this.util.msj = result.msj;

        if (!result.error) {
          this.usuarioService.Usuarios.splice(this.usuarioService.indexUsuarioSelected, 1);
          this.closeModal();
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });

  }
  private actualizarPermisosUsuario() {
    console.log("this.PermisosSelected", this.PermisosSelected);
    let isChangePermisos = { isChangePermisos: false, };
    if (!this.util.compare(this.PermisosSelected.value, this.PermisosSelected.valueAnt)) {
      isChangePermisos.isChangePermisos = true;
      isChangePermisos["permisosSelected"] = this.PermisosSelected.value;
      isChangePermisos["usuarioSelected"] = {id: this.UsuarioSelected.id, email: this.UsuarioSelected.email};
    }
    console.log("isChangePermisos", isChangePermisos);

    this.util.msjLoading = "Actualizando permisos asignados al Usuario: " + this.UsuarioSelected.email;
    this.util.crearLoading().then(() => {
      this.usuarioService.actualizarPermisos_Usuario(isChangePermisos).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.eror);
        this.util.msj = result.msj;

        if (!result.error) {
          if (isChangePermisos.isChangePermisos) {
            if (!result.permisos.error) {
              this.usuarioService.Usuarios[this.usuarioService.indexUsuarioSelected].permisos = result.permisos.permisos;
            } else{
              this.util.msjToast(result.permisos.msj, result.permisos.titulo, result.permisos.error);
            }
          }
          this.util.cerrarModal("#modalPermisos_Usuario");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  private agregarImagen(e) {
    console.log("Rtua Img ", this.rutaImg);
    console.log(e);
    console.log(this.Usuario.value);
    var file = e.target.files[0],
      imageType = /image.*/;
    if (!file.type.match(imageType))
      return;
    //this.rutaImg = e.target.value;

    /*reader.onload = this.fileOnload(e);
    reader.readAsDataURL(file);*/
  }
  /*
  public fileOnload(e) {
    var result=e.target.result;
    $('#imgSalida').attr("src",result);
  }*/
}
