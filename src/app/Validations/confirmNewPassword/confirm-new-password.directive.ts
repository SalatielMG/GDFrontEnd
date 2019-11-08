import { Directive } from '@angular/core';
import {AbstractControl, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  selector: '[appCofirmNewPassword]'
})
export class ConfirmNewPasswordDirective implements Validator{

  constructor() { }

  // @ts-ignore
  public confirmNewPassword(): ValidatorFn {
    return (control: AbstractControl) => {
      return this.validate(control);
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const confirmPassword = <string>control.value;
    return undefined;
  }

}
