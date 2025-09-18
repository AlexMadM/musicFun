import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Если токен есть — клонируем запрос и добавляем заголовок Authorization
  const token = localStorage.getItem('accessToken');
  let headers = req.headers.set(
    'API-KEY',
    '8b16e0c3-ae7f-4fdb-8ebd-f096a669a86c'
  );

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const authReq = req.clone({ headers });
  return next(authReq);
};
