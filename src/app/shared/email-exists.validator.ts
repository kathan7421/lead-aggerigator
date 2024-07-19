import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EmailCheckService } from './email-check.service';

export function emailExistsValidator(emailCheckService: EmailCheckService, userId: number): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return control.valueChanges.pipe(
      switchMap(email => emailCheckService.checkEmailExists(email, userId).pipe(
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null))
      ))
    );
  };
}
