import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { tokenInterceptorFn } from './app/core/interceptors/token.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptorFn])),
    provideRouter(routes)
  ]
}).catch(err =>
  console.error(err)
);
