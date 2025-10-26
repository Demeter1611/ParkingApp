import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function forbiddenPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    for(const character of control.value){
      if(!isNaN(parseInt(character))){
        return null;
      }
    }
    return {forbiddenpassword: {number: false}};
  };
}

export const matchingPasswordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { matchingpasswords: true } : null;
}
