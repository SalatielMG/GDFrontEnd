import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';
import {Utilerias} from '../../../../Utilerias/Util';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmPasswordCurrentDirective} from '../../../../Validations/confirmPasswordCurrent/confirm-password-current.directive';
import {ConfirmNewPasswordDirective} from '../../../../Validations/confirmNewPassword/confirm-new-password.directive';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  @ViewChild("cntPermisos", {read: "", static: false}) cntPermisos = ElementRef;
  public isExpandCntPermisos: boolean = true;
  public isConfirmPasswordCurrent: boolean = false;
  public Usuario: FormGroup = null;
  public Password: FormGroup = null;
  public isChangeIMG = false;
  public fileIMG = null;

  constructor(public usuarioService: UsuarioService, public util: Utilerias, public renderer: Renderer2, public formBuilder: FormBuilder, public confirmPasswordCurrentDirective: ConfirmPasswordCurrentDirective, public confirmNewPasswordDirective: ConfirmNewPasswordDirective ) {

  }

  ngOnInit() {
    this.confirmPasswordCurrentDirective.enviarPasswordVerifyObservable.subscribe(verifyNoPasssword => {
      console.log("Password NO verify", verifyNoPasssword);
      if (!verifyNoPasssword) {
        this.isConfirmPasswordCurrent = true;
        this.Password.get("confirmPasswordCurrent").disable();
        this.Password.addControl("newPassword", new FormControl('', {
          validators:[Validators.required]
        }));
        this.Password.addControl("confirmNewPassword", new FormControl('', {
          validators:[Validators.required, this.confirmNewPasswordDirective.validate.bind(this.confirmNewPasswordDirective)]
        }));
      }
    });
  }

  public actionUpdateUsuario(){
    this.Usuario = this.formBuilder.group({
      id: [this.usuarioService.UsuarioCurrent.id, [Validators.required]],
      email: [this.usuarioService.UsuarioCurrent.email, [Validators.required, Validators.email, Validators.maxLength(50)]],
      tipo: [this.usuarioService.UsuarioCurrent.tipo, [Validators.required]],
      cargo: [this.usuarioService.UsuarioCurrent.cargo, [Validators.required]]
      //imagen: [usuario.imagen, ],
    });
    this.Usuario.get("tipo").disable();
  }
  public actionResetPassword() {
    this.isConfirmPasswordCurrent = false;
    this.Password = this.formBuilder.group({
      confirmPasswordCurrent: ['', {
        validators: [Validators.required],
        asyncValidators: [this.confirmPasswordCurrentDirective.validate.bind(this.confirmPasswordCurrentDirective)],
        updateOn: "submit"
      }]
    });
  }
  public getError(controlName: string, isPasswordReset = false): string {
    //console.log(isPasswordReset);
    if (!isPasswordReset) {
      let error = '';
      const control = this.Usuario.get(controlName);
      if (control.touched && control.errors != null && control.invalid) {
        //console.log("Error Control:=[" + controlName + "]", control.errors);
        error = this.util.hasError(control);
      }
      return error;
    } else {
      let error = '';
      const control = this.Password.get(controlName);
      if (control.touched && control.errors != null && control.invalid) {
        //console.log("Error Control:=[" + controlName + "]", control.errors);
        error = this.util.hasError(control);
      }
      return error;
    }
  }

  public closeModal(nameModal = "#modalUsuarioUpdate") {
    this.util.cerrarModal(nameModal);
    if (nameModal == "#modalUsuarioUpdate") {
      this.Usuario = null;
    } else {
      this.Password = null;
    }
  }

  public UpdateUsuario(){
    console.log("Value Usuario Form:= ", this.Usuario.value);
    this.util.msjLoading = "Actualizando datos de su perfil";
    this.util.crearLoading().then(() => {
      this.usuarioService.UpdateProfile(this.Usuario.value, {id: this.usuarioService.UsuarioCurrent.id, email: this.usuarioService.UsuarioCurrent.email}).subscribe(result => {
        this.util.detenerLoading();
        this.util.msjToast(result.msj, result.titulo, result.error);
        if (!result.error) {
          if (!result.usuario.error) {
            this.usuarioService.UsuarioCurrent.email = result.usuario.usuarios[0].email;
            this.usuarioService.UsuarioCurrent.cargo = result.usuario.usuarios[0].cargo;
            this.usuarioService.actualizarStorage();
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

  public UpdatePasword() {
    if (this.isConfirmPasswordCurrent) {
      this.util.msjLoading = "Actualizando contraseña actual";
      this.util.crearLoading().then(() => {
        this.usuarioService.UpdatePassword(this.Password.value.newPassword).subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          if (!result.error) {
            this.closeModal("#modalResetPassword");
          }
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
      console.log(this.Password.value);
    }
  }

  public verficarExpansion() {
    this.renderer.setStyle(this.cntPermisos['nativeElement'], "transition", "height 500ms, max-height 500ms, padding 500ms");
    if (this.isExpandCntPermisos) { // Expandir
      //             this.expandir(575, 13, this.cntBackupsUser['_results'][indice].nativeElement);
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "height", 575 + "px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "max-height", 575 + "px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "padding", 13 + "px 16px")
    } else { // Ocultar
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "height", "0px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "max-height", "0px");
      this.renderer.setStyle(this.cntPermisos['nativeElement'], "padding", "0px 16px");
    }
    this.isExpandCntPermisos = !this.isExpandCntPermisos;
  }
  public obtURLIMG() {
    return this.usuarioService.url + 'util/avatar/' + this.usuarioService.UsuarioCurrent.imagen;
  }
  public actualizarImagen(event) {
    this.isChangeIMG = false;
    this.fileIMG = null;
    var files = event.target.files;
    var file = files[0],
      imageType = /image.*/;
    if (!file.type.match(imageType)) {
      alert("Porfavor ingrese un formato de imagen valido");
      return;
    }
    if (files && file) {
      this.isChangeIMG = true;
      this.fileIMG = file;
      this.util.msjLoading = "Actualizando imagen de perfil";
      this.util.crearLoading().then(() => {
        this.usuarioService.UpdateImage(this.isChangeIMG, this.fileIMG).subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          if (!result.error) {
            this.usuarioService.UsuarioCurrent.imagen = null;
            this.usuarioService.UsuarioCurrent.imagen = result.generatedName;
            this.usuarioService.actualizarStorage();
          }
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    }
    console.log(this.fileIMG);
  }
  public confirmNewPassword(event) {
    this.util.newPassword = this.Password.value.newPassword;
  }
}
