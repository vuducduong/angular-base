import { AbstractControl, FormControl, ValidatorFn } from "@angular/forms";
import moment from "moment";

export function dateTimeValidator(AC: AbstractControl) {
  if (AC && AC.value && !moment(AC.value, 'YYYY/MM/DD', true).isValid()) {
    return { 'validatorDateTime': true }
  }
  return null;
}

export function removeAllWhitespace(control: FormControl) {
  if (control && control.value) {
    const cleanedValue = control.value.replace(/\s+/g, '');
    if (cleanedValue !== control.value) {
      control.setValue(cleanedValue, { emitEvent: false });
      control.updateValueAndValidity({ emitEvent: false });
    }
  }
  return null;
}

export function removeWhitespace(control: FormControl) {
  if (control && control.value) {
    const trimmedValue = control.value.trim();
    const cleanedValue = trimmedValue.length === 0 ? "" : trimmedValue;
    if (cleanedValue !== control.value) {
      control.setValue(cleanedValue, { emitEvent: false });
      control.updateValueAndValidity({ emitEvent: false });
    }
    if (cleanedValue === "") {
      return { 'required': true };
    }
  }
  return null;
}

export function conditionalValidators(minLength: number, maxLength: number, pattern: RegExp): ValidatorFn {
  return (control: AbstractControl) => {
    if (!(pattern instanceof RegExp)) {
      return { pattern: true };
    }

    if (!control.value) {
      return null;
    }

    if (control.value.length < minLength || control.value.length > maxLength) {
      return null;
    }

    const validPattern = pattern.test(control.value);
    return validPattern ? null : { pattern: true };
  };
}