import { Routes } from '@angular/router';
import { IdentificacaoComponent } from './components/identificacao/identificacao.component';
import { HomeComponent } from './components/home/home.component';
import { ModuloComponent } from './components/modulo/modulo.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { TabuadaComponent } from './components/tabuada/tabuada.component';
import { PaisComponent } from './components/pais/pais.component';
import { alunoGuard } from './guards/aluno.guard';

export const routes: Routes = [
  // Tela inicial: a criança se identifica
  { path: '', component: IdentificacaoComponent, title: 'Quem é você? 👋' },

  // Telas de estudo (exigem aluno identificado)
  {
    path: 'menu',
    component: HomeComponent,
    title: 'Matemática Divertida 🧮',
    canActivate: [alunoGuard],
  },
  {
    path: 'modulo/:tema',
    component: ModuloComponent,
    title: 'Aula 🎬',
    canActivate: [alunoGuard],
  },
  {
    path: 'quiz/:tema',
    component: QuizComponent,
    title: 'Quiz 🚀',
    canActivate: [alunoGuard],
  },
  {
    path: 'tabuada',
    component: TabuadaComponent,
    title: 'Complete a Tabuada 🔢',
    canActivate: [alunoGuard],
  },

  // Tela "escondida" dos pais (não há link visível para a criança)
  { path: 'pais', component: PaisComponent, title: 'Área dos Pais 🔒' },

  // Qualquer rota inválida volta para a identificação
  { path: '**', redirectTo: '' },
];
