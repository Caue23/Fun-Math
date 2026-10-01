import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressoService } from '../../services/progresso.service';

@Component({
  selector: 'app-identificacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './identificacao.component.html',
  styleUrl: './identificacao.component.scss',
})
export class IdentificacaoComponent implements OnInit {
  private readonly progresso = inject(ProgressoService);
  private readonly router = inject(Router);

  nome = '';

  ngOnInit(): void {
    // Se já tem alguém usando neste dispositivo, pré-preenche o nome
    const atual = this.progresso.obterNomeAtual();
    if (atual) this.nome = atual;
  }

  entrar(): void {
    const limpo = this.nome.trim();
    if (!limpo) return;
    this.progresso.definirAluno(limpo);
    this.router.navigate(['/menu']);
  }
}
