import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

const isAuthRoute = (url: string) =>
  url.includes('/auth/login') ||
  url.includes('/auth/register') ||
  url.includes('/auth/refresh');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = localStorage.getItem('accessToken');

  const authorizedRequest =
    accessToken && !isAuthRoute(req.url)
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : req;

  return next(authorizedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      const refreshToken = localStorage.getItem('refreshToken');
      const shouldRefresh =
        !isAuthRoute(req.url) &&
        !!refreshToken &&
        (error.status === 401 || error.status === 403);

      if (!shouldRefresh) {
        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap((newAccessToken) =>
          next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }),
          ),
        ),
        catchError((refreshError) => {
          authService.logout();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
