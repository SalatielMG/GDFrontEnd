import {Directive, Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors, Validator} from '@angular/forms';
import {Utilerias} from '../../Utilerias/Util';

@Directive({
  selector: '[appCofirmNewPassword]'
})
@Injectable({
  providedIn: 'root'
})
export class ConfirmNewPasswordDirective implements Validator{

  constructor(private util: Utilerias) { }
  validate(control: AbstractControl): ValidationErrors | null {
    const confirmPassword = <string>control.value;
    if (this.util.newPassword != confirmPassword){
      return {NoConfirmNewPassword: true};
    }
    return null;
  }

}
