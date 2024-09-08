// crea un interceptor personalizado para interceptar las solicitudes HTTP y agregar un encabezado de autorización a cada solicitud.

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, throwIfEmpty } from 'rxjs/operators';

@Injectable()
export class CustomInterceptorHttp implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Clona la solicitud HTTP y agrega el encabezado de autorización
		// const clonedReq = req.clone({
		// 	headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
		// });
		const clonedReq = req.clone();

		return next.handle(clonedReq).pipe(
			tap((event: HttpEvent<any>) => {
				// Aquí puedes manejar la respuesta
				if (event.type === HttpEventType.Response) {
					console.log('Response intercepted:', event);
					// Puedes agregar lógica adicional para manejar la respuesta aquí
				}
			}),
			catchError((error: HttpErrorResponse) => {
				let errorMessage = '';
				// Error del lado del cliente
				// if (error.status === 404) {
				// 	// Maneja el error 404 devolviendo un array vacío o algún valor predeterminado
				// 	return []; throwIfEmpty
				// }
				if (error.error instanceof ErrorEvent) {
					// Error del lado del cliente
					errorMessage = `Client-side error: ${error.error.message}`;
				} else {
					// Error del lado del servidor
					errorMessage = `Server-side error: ${error.status} ${error.message}`;
				}

				// Aquí puedes agregar lógica adicional para manejar el error, como mostrar una notificación
				console.error(errorMessage);

				// Retorna un observable con un mensaje de error
				return throwError(() => new Error(errorMessage));
			})
		);
	}
}



