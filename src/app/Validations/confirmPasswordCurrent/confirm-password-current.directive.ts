import {Directive, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {UsuarioService} from '../../Servicios/usuario/usuario.service';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Directive({
  selector: '[confirmPasswordCurrent]',
  //providers: [{provide: NG_ASYNC_VALIDATORS, useValue: ConfirmPasswordCurrentDirective, multi: true }]
})

@Injectable({
  providedIn: 'root'
})
export class ConfirmPasswordCurrentDirective implements AsyncValidator{

  private passwordVerify: boolean = false;
  private enviarPasswordVerifySubject = new Subject<boolean>();
  enviarPasswordVerifyObservable = this.enviarPasswordVerifySubject.asObservable();

  constructor(private usuarioService: UsuarioService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const password = control.value;
    return this.usuarioService.verifyPasswordCurrent(password).pipe(map( result => {
      this.enviarPaswordVerify(result.error);
      if (result.error) {

        return {passwordNoVerify: true};
      }
      return null
    }));
  }

  public enviarPaswordVerify(isVerify: boolean){
    this.passwordVerify = isVerify;
    this.enviarPasswordVerifySubject.next(isVerify);
  }


}
