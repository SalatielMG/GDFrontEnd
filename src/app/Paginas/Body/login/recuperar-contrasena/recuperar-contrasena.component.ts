import { Component, OnInit } from '@angular/core';
import {Utilerias} from '../../../../Utilerias/Util';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {VerifyExixtsEmailAndSendCodeDirective} from '../../../../Validations/verifyExitsEmailAndSendCode/verify-exixts-email-and-send-code.directive';
import {VerifyCodeResetPasswordDirective} from '../../../../Validations/verifyCodeResetPassword/verify-code-reset-password.directive';
import {ConfirmNewPasswordDirective} from '../../../../Validations/confirmNewPassword/confirm-new-password.directive';
import {UsuarioService} from '../../../../Servicios/usuario/usuario.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent implements OnInit {

  public formResetPasword: FormGroup;
  public status: number = 0;

  constructor(public usuarioService: UsuarioService, public util: Utilerias, public route: ActivatedRoute,
              public router: Router, public formBuilder: FormBuilder, public verifyExixtsEmailAndSendCodeDirective: VerifyExixtsEmailAndSendCodeDirective, public verifyCodeResetPasswordDirective: VerifyCodeResetPasswordDirective, public confirmNewPasswordDirective: ConfirmNewPasswordDirective) {
    this.util.emailResetPassword = "";
    this.route.paramMap.subscribe(params => {
      this.buildForm(params.get('email'));
    });
  }
  private buildForm(email: string) {
    this.formResetPasword = this.formBuilder.group({
      email: [email,
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.verifyExixtsEmailAndSendCodeDirective.validate.bind(this.verifyExixtsEmailAndSendCodeDirective)],
          updateOn: "submit"
        }],
    });
  }

  ngOnInit() {
    this.verifyExixtsEmailAndSendCodeDirective.enviarEmailVerifyObservable.subscribe(verifyNoEmail => {
      if (!verifyNoEmail) {
        this.status = 1; // EmailVerificado y codigo de reseteo enviado al correo verificado
        this.util.emailResetPassword = this.formResetPasword.value.email;
        this.formResetPasword.get('email').disable();
        this.formResetPasword.addControl("codigo", new FormControl('', {
          validators: [Validators.required, Validators.maxLength(5)],
          asyncValidators: [this.verifyCodeResetPasswordDirective.validate.bind(this.verifyCodeResetPasswordDirective)],
          updateOn: "submit"
        }));
      }
    });
    this.verifyCodeResetPasswordDirective.enviarCodeVerifyObservable.subscribe(verifyNoCode => {
      if (!verifyNoCode) {
        this.status = 2; // Codigo de reseteo verificado
        this.formResetPasword.get('codigo').disable();
        //this.util.emailResetPassword = "";
        this.util.newPassword = "";
        this.formResetPasword.addControl("newPassword", new FormControl('', {
          validators: [Validators.required]
        }));
        this.formResetPasword.addControl("confirmNewPassword", new FormControl('', {
          validators: [Validators.required, this.confirmNewPasswordDirective.validate.bind(this.confirmNewPasswordDirective)]
        }));
      }
    });
  }

  public confirmNewPassword(event) {
    this.util.newPassword = this.formResetPasword.value.newPassword;
  }
  public getError(controlName: string): string {
    let error = '';
    const control = this.formResetPasword.get(controlName);
    if (control.touched && control.errors != null && control.invalid) {
      error = this.util.hasError(control);
    }
    return error;
  }
  public resetPasword() {
    if (this.status == 2) {
      this.util.msjLoading = "Actualizando contraseña actual";
      this.util.crearLoading().then(() => {
        this.usuarioService.ResetPassword(this.formResetPasword.value.newPassword, this.util.emailResetPassword).subscribe(result => {
          this.util.detenerLoading();
          this.util.msjToast(result.msj, result.titulo, result.error);
          if (!result.error) {
            this.util.emailResetPassword = "";
            this.router.navigate(["/login"]);
          }
        }, error => {
          this.util.msjErrorInterno(error);
        });
      });
    }
  }

}
