---
target: landing page (src/app/page.tsx)
total_score: 19
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:C:\\Users\\joaov\\OneDrive\\Área de Trabalho\\Zenith Workspace\\src\\app\\page.tsx"
target_fingerprint: "sha256:1b5d368b58fd24ded162ea5fc23deeb93cc269c8efba7c18a199cdfd89753d14"
target_path: "C:\\Users\\joaov\\OneDrive\\Área de Trabalho\\Zenith Workspace\\src\\app\\page.tsx"
timestamp: 2026-10-01T06-34-24Z
slug: src-app-page-tsx
closed: true
---
Method: dual-agent (A: design review · B: detector + browser)

## Nota (Nielsen) — 19/32 (59%, Aceitável); n/a: 7, 10
| # | Heurística | Nota | Principal problema |
|---|---|---|---|
| 1 | Visibilidade do estado | 2 | Busca só conta, não filtra; resultado fora da tela no mobile |
| 2 | Mundo real | 2 | "em Rio de Janeiro"; "out.."; "Reserve com 1 clique" vs. 4 campos; sem horário de término |
| 3 | Controle e liberdade | 3 | Esc/backdrop/X ok; sem editar após confirmar |
| 4 | Consistência | 2 | Critérios da busca não chegam ao modal; "Reservar" header ≠ "Reservar agora" |
| 5 | Prevenção de erros | 1 | Aceita 20:00+8h, horário passado, grupo 10 na mesa de 1 |
| 6 | Reconhecimento | 3 | Cards completos; modal sem capacidade |
| 7 | Flexibilidade | n/a | Landing (Persuade) |
| 8 | Estética/minimalismo | 3 | "por hora" repetido 3x acima da dobra |
| 9 | Recuperação de erros | 2 | Zero resultados sem ação de um clique |
| 10 | Ajuda | n/a | Landing (Persuade); falta de políticas tratada como P1 |

## Especificidade: reprovada (por pouco)
Estrutura de template (hero centralizado + pílula + 3 diferenciais + grade + 3 passos com ícone + 3 depoimentos). Diferenciais como adjetivos. Único momento próprio: revelação do QR na confirmação.
Detector (navegador): icon-tile-stack x3 (how-it-works.tsx:26) procede; overused-font (Geist) procede; image-hover-transform x6 (space-card.tsx:22) leve/estilo; gpt-thin-border-wide-shadow provável falso positivo (sombra só no hover); dark-glow #ffba00 falso positivo (overlay do próprio detector). CLI: 0 achados.

## Funciona
1. Base de a11y/interação (dialog nativo, foco, aria-live, popover, 44px, 16px, movimento reduzido)
2. Resumo de preço ao vivo no modal
3. Honestidade de protótipo

## Problemas prioritários
- [P1] Busca decorativa: não filtra grade, critérios não chegam ao modal (search-bar.tsx:46-51, featured-spaces.tsx:46-49). Fix: estado compartilhado, filtrar, pré-preencher data, avisar capacidade, rolar ao resultado no mobile. /impeccable harden + adapt
- [P1] Reservas impossíveis aceitas (booking-modal.tsx:18-19). Fix: intervalo ao vivo, limitar duração ao funcionamento, desativar horários passados. /impeccable harden
- [P1] Sem garantia no commit (políticas removidas por decisão do usuário; mostrar "a definir (protótipo)" + destino do código). /impeccable clarify
- [P1] Composição genérica: passe de reserva no hero, selo Verificado com critério, "Como funciona" com artefatos reais. /impeccable bolder (ou shape)
- [P2] Texto: "out..", "em Rio", "1 clique", Total = subtotal. /impeccable clarify

## Personas
Jordan: "Reservar" do header só rola; busca parece quebrada; "verificado" sem significado.
Riley: 20h-04h aceito; horário passado; grupo 10 na mesa de 1; "4,9" sem contagem; favicon 404.
Casey: resultado fora da tela; X no canto superior; sem arrastar para fechar; selects pequenos.

## Menores
Modal sem foto; confirmação sem endereço/calendário; comodidades desalinham preços; H1/H2 sem voz tipográfica; rodapé sem saída; faixa vazia ~130px após o hero.

## Perguntas
Busca sem efeito como centro do hero? Conta horas×preço fora do modal? "Verificado" comprovável? QR como primeira imagem?
