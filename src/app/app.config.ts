import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      // Sempre volta ao topo ao trocar de rota (bom para a navegação da criança)
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
  ],
};
