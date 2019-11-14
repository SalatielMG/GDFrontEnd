import {Directive, Injectable} from '@angular/core';
import {UsuarioService} from '../../Servicios/usuario/usuario.service';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Utilerias} from '../../Utilerias/Util';

@Directive({
  selector: '[VerifyExixtsEmailAndSendCode]'
})
@Injectable({
  providedIn: 'root'
})
export class VerifyExixtsEmailAndSendCodeDirective implements AsyncValidator {

  private emailVerify: boolean = false;
  private enviarEmailVerifySubject = new Subject<boolean>();
  enviarEmailVerifyObservable = this.enviarEmailVerifySubject.asObservable();

  constructor(private usuarioService: UsuarioService, private util: Utilerias) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const email = control.value;
    return this.usuarioService.verifyEmailAndSendCode(email).pipe(map( result => {
      this.util.msjToast(result.msj, result.titulo, result.error);
      this.enviarEmailVerify(result.error);
      if (result.error) {
        return {emailNoVerify: true};
      }
      return null
    }));
  }

  public enviarEmailVerify(isVerify: boolean) {
    this.emailVerify = isVerify;
    this.enviarEmailVerifySubject.next(isVerify);
  }

}
