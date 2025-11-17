import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const num = parseFloat(control.value);
      return num > 0 ? null : { positiveNumber: true };
    };
  }

  static nonNegativeNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const num = parseFloat(control.value);
      return num >= 0 ? null : { nonNegativeNumber: true };
    };
  }

  static cpfFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const cpf = control.value.replace(/\D/g, "");
      return cpf.length === 11 ? null : { cpfFormat: true };
    };
  }

  static cepFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const cep = control.value.replace(/\D/g, "");
      return cep.length === 8 ? null : { cepFormat: true };
    };
  }

  static phoneFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const phone = control.value.replace(/\D/g, "");
      return phone.length === 11 ? null : { phoneFormat: true };
    };
  }

  static decimalPlaces(maxPlaces: number = 2): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const str = String(control.value);
      if (!str.includes(".")) return null;
      const decimals = str.split(".")[1].length;
      return decimals <= maxPlaces ? null : { decimalPlaces: true };
    };
  }

  static matchPasswords(passwordField: string, confirmField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirm = control.get(confirmField);

      if (!password || !confirm) return null;
      if (!password.value && !confirm.value) return null;

      return password.value === confirm.value ? null : { passwordMismatch: true };
    };
  }

  static stateBrazil(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const validStates = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
        "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
        "RS", "RO", "RR", "SC", "SP", "SE", "TO"
      ];
      return validStates.includes(control.value.toUpperCase()) ? null : { invalidState: true };
    };
  }

  static uniqueAccounts(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const origin = control.parent?.get("numeroContaDestino")?.value;
      const destination = control.value;
      return origin === destination ? { sameAccount: true } : null;
    };
  }
}
