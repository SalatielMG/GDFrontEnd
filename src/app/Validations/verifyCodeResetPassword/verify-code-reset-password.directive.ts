import {Directive, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {UsuarioService} from '../../Servicios/usuario/usuario.service';
import {map} from 'rxjs/operators';
import {Utilerias} from '../../Utilerias/Util';

@Directive({
  selector: '[appVerifyCodeResetPassword]'
})
@Injectable({
  providedIn: 'root'
})
export class VerifyCodeResetPasswordDirective implements AsyncValidator {

  private codeVerify: boolean = false;
  private enviarCodeVerifySubject = new Subject<boolean>();
  enviarCodeVerifyObservable = this.enviarCodeVerifySubject.asObservable();

  constructor(private usuarioService: UsuarioService, private util: Utilerias) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const code = control.value;
    return this.usuarioService.verifyCodeResetPasword(code, this.util.emailResetPassword).pipe(map( result => {
      this.enviarCodeVerify(result.error);
      if (result.error) {
        return {codeNoVerify: true};
      } else {
        this.util.msjToast(result.msj, result.titulo, result.error);
      }
      return null
    }));
  }
  public enviarCodeVerify(isVerify: boolean) {
    this.codeVerify = isVerify;
    this.enviarCodeVerifySubject.next(isVerify);
  }

}
