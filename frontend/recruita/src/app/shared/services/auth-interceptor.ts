import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../../features/auth/services/auth';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(Auth);

    const token = localStorage.getItem('access_token');
    let authReq = token
      ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      : req;


    return next(authReq).pipe(
      catchError((error) => {
        if (error.status == 401) {
          authService.logout();
        }
        return throwError(() => error);
      })
    );

}

