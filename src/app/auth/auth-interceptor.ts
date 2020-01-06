import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    const httpReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    // if (token) {

    // }
    return next.handle(httpReq);
  }
}
