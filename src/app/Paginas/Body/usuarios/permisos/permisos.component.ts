import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
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

  public option: string = "";
  public PermisoSelected = new Permisos();
  public UsersSelected = {
    value: [],
    valueAnt: []
  };
  public Permiso: FormGroup = null;
  public isExpandUseCard: boolean = false;
  public isUpdateUsuariosSelectPermiso: boolean = false;

  @ViewChild("cntUsers", {read: "", static: false}) cntUsers = ElementRef;

  constructor(public util: Utilerias, public permisoService: PermisoService, public usuarioService: UsuarioService, public formBuilder: FormBuilder, public renderer: Renderer2) {
    this.permisoService.resetVariables();
    this.sarchPermisosGral();
  }

  ngOnInit() {
  }

  public sarchPermisosGral() {
    this.util.QueryComplete.isComplete = false;
    this.util.msjLoading = "Cargando permisos registrados en la Base de Datos";
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
  public resetUserSelected() {
    this.UsersSelected.value = [];
    this.UsersSelected.valueAnt = [];
  }
  public obtUsuariosGral(isExpanded = true) {
    this.util.msjLoading = "Cargando usuarios";
    this.util.crearLoading().then(() => {
      this.usuarioService.obtUsuariosGral(this.usuarioService.UsuarioCurrent.id.toString(), "0").subscribe(result => {
        this.util.detenerLoading();
        if (!result.error) {
          this.permisoService.UsuariosGal = result.usuarios;
          this.isExpandUseCard = true;
          if (this.option != this.util.AGREGAR) {
            for (let user of this.PermisoSelected.usuarios) {
              this.UsersSelected.valueAnt.push(user.id);
              this.permisoService.UsuariosGal.forEach((u) => {
                if (u.id == user.id){
                  u.checked = true;
                }
              });
            }
            this.UsersSelected.value = this.UsersSelected.value.concat(this.UsersSelected.valueAnt);
          }
          if (isExpanded) this.verifyExpandCardUser();
          else this.util.abrirModal("#modalUsuarios_Permiso");
        } else {
          this.util.msjToast(result.msj, result.titulo, result.error);
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
  }
  public cargarUsuariosGral() {
    this.isExpandUseCard = !this.isExpandUseCard;
    this.resetUserSelected();
    //this.verifyExpandCardUser();
    if (this.isExpandUseCard) { // Expandir y obtener permisos generales.
      this.obtUsuariosGral();
    } else this.verifyExpandCardUser();
  }
  public actionPermiso(option, permiso = new Permisos(), index = null) {
    this.option = option;
    this.buildForm(permiso);
    this.resetUserSelected();
    this.isExpandUseCard = false;
    if (this.option != this.util.AGREGAR) {
      this.PermisoSelected = permiso;
      this.permisoService.indexPermisoSelected = index;
      if (this.util.isDelete(this.option)) {
        this.cargarUsuariosGral();
      }
    }
  }
  public actionUsuariosPermiso(option, permiso: Permisos, index) {
    this.isUpdateUsuariosSelectPermiso = false;
    this.option = option;
    this.resetUserSelected();
    if (this.option == this.util.CONSULTA) {
      this.PermisoSelected = permiso;
      this.permisoService.indexPermisoSelected = index;
      this.obtUsuariosGral(false);
    }
  }
  // ---------------------------- CheckUser
  public checkUser(index) {
    console.log("this.option", this.option);
    console.log("this.isUpdateUsuariosSelectPermiso", this.isUpdateUsuariosSelectPermiso);
    if (this.util.isDelete(this.option) || (this.option == this.util.CONSULTA && !this.isUpdateUsuariosSelectPermiso)) return;
    if (this.permisoService.UsuariosGal[index].checked) { // Uncheck =>
      let posInArrayUserSelected = this.UsersSelected.value.indexOf(this.permisoService.UsuariosGal[index].id);
      if (posInArrayUserSelected != -1) {
        this.UsersSelected.value.splice(posInArrayUserSelected, 1);
      }
    } else { // Uncheck =>
      if (!this.UsersSelected.value.includes(this.permisoService.UsuariosGal[index].id)) {
        this.UsersSelected.value.push(this.permisoService.UsuariosGal[index].id);
      }
    }
    this.permisoService.UsuariosGal[index].checked = !this.permisoService.UsuariosGal[index].checked;
    console.log("this.UsersSelected.value", this.UsersSelected.value);
    console.log("this.UsersSelected.valueAnt", this.UsersSelected.valueAnt);
  }
  // ---------------------------- CheckUser
  public verifyExpandCardUser() {
    console.log(this.cntUsers);
    let H = (this.util.obtisFullHDDisplay()) ? 300: 220;
    if (this.isExpandUseCard) {
      this.renderer.setStyle(this.cntUsers['nativeElement'], "transition", "height 500ms, max-height 500ms");
      this.renderer.setStyle(this.cntUsers['nativeElement'], "height", H + "px");
      this.renderer.setStyle(this.cntUsers['nativeElement'], "max-height", H + "px");
    } else {
      this.renderer.setStyle(this.cntUsers['nativeElement'], "transition", "height 500ms, max-height 500ms");
      this.renderer.setStyle(this.cntUsers['nativeElement'], "height", "0px");
      this.renderer.setStyle(this.cntUsers['nativeElement'], "max-height", "0px");
    }
  }
  public buildForm(permiso: Permisos) {
    this.Permiso = this.formBuilder.group({
      id: [permiso.id, [Validators.required]],
      permiso: [permiso.permiso, [Validators.required, Validators.maxLength(50)]],
      descripcion: [permiso.descripcion, [Validators.maxLength(255)]],
    });
    if (this.util.isDelete(this.option)) this.disable();
  }
  public getError(controlName: string): string {
    let error = '';
    const control = this.Permiso.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      console.log("Error Control:=[" + controlName + "]", control.errors);
      error = this.util.hasError(control);
    }
    return error;
  }

  public disable() {
    for (let key in this.Permiso.getRawValue()) {
      this.Permiso.get(key).disable();
    }
    this.Permiso.disable();
  }
  public closeModal() {
    this.util.cerrarModal("#modalPermiso").then(() => {
      this.option = "";
      this.Permiso = null;
    });
  }
  public operation() {
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
    console.log(this.Permiso.value);
    console.log("this.UsersSelected.value", this.UsersSelected.value);
    console.log("this.UsersSelected.valueAnt", this.UsersSelected.valueAnt);
  }
  public agregarPermiso() {
    this.util.msjLoading = "Agregando nuevo Permiso " + this.Permiso.value.permiso;
    this.util.crearLoading().then(() => {
      this.permisoService.agregarPermiso(this.Permiso.value, this.UsersSelected.value).subscribe(result => {
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
  public actualizarPermiso() {
    console.log("this.UsersSelected", this.UsersSelected);
    console.log("value == ValueAnt", (this.UsersSelected.value == this.UsersSelected.valueAnt));
    let isChangeUsers = { isChangeUsers: false, };
    if (!this.util.compare(this.UsersSelected.value, this.UsersSelected.valueAnt)) {
      isChangeUsers.isChangeUsers = true;
      isChangeUsers["userSelected"] = this.UsersSelected.value;
    }
    //this.UsersSelected.value.
    this.util.msjLoading = "Actualizando Permiso " + this.PermisoSelected.permiso;
    this.util.crearLoading().then(() => {
      this.permisoService.actualizarPermiso(this.Permiso.value, this.PermisoSelected, isChangeUsers).subscribe(result => {
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
  public eliminarPermiso() {
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

  public actualizarUsuariosPermisos() {
    console.log("this.UsersSelected", this.UsersSelected);
    let isChangeUsers = { isChangeUsers: false, };
    if (!this.util.compare(this.UsersSelected.value, this.UsersSelected.valueAnt)) {
      isChangeUsers.isChangeUsers = true;
      isChangeUsers["userSelected"] = this.UsersSelected.value;
      isChangeUsers["permisoSelected"] = {id: this.PermisoSelected.id, permiso: this.PermisoSelected.permiso};
    }
    this.util.msjLoading = "Actualizando usuario asignados al Permiso: " + this.PermisoSelected.permiso;
    this.util.crearLoading().then(() => {
      this.permisoService.actuaizarUsuarios_Permiso(isChangeUsers).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error ) {
          if (isChangeUsers.isChangeUsers) {
            if (!result.usuarios.error) {
              this.permisoService.Permisos[this.permisoService.indexPermisoSelected].usuarios = result.usuarios.usuarios;
            } else {
              this.util.msjToast(result.usuarios.msj, result.usuarios.titulo, result.usuarios.error);
            }
          }
          this.util.cerrarModal("#modalUsuarios_Permiso");
        }
      }, error => {
        this.util.msjErrorInterno(error);
      });
    });
    console.log("isChangeUsers", isChangeUsers);
    console.log("this.permisoService.indexPermisoSelected", this.permisoService.indexPermisoSelected);
  }
}
