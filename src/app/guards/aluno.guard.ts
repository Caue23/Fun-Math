import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProgressoService } from '../services/progresso.service';

/**
 * Impede o acesso às telas de estudo sem um aluno identificado.
 * Se ninguém estiver "logado", manda de volta para a tela de identificação (/).
 */
export const alunoGuard: CanActivateFn = () => {
  const progresso = inject(ProgressoService);
  const router = inject(Router);

  if (progresso.temAlunoAtual()) {
    return true;
  }
  return router.createUrlTree(['/']);
};
