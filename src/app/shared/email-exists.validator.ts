import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EmailCheckService } from './email-check.service';

export function emailExistsValidator(emailCheckService: EmailCheckService, currentId?: number): AsyncValidatorFn {
  return (control: AbstractControl): Observable<any> => {
    if (!control.value || control.value.trim() === '') {
      return of(null); // No validation if the field is empty
    }

    return emailCheckService.checkEmailExists(control.value, currentId).pipe(
      map(response => {
        return response.exists ? { emailExists: true } : null;
      }),
      catchError(() => of(null))
    );
  };
}
