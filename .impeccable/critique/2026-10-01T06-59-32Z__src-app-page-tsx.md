---
target: landing page (src/app/page.tsx)
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\joaov\\OneDrive\\Área de Trabalho\\Zenith Workspace\\src\\app\\page.tsx"
target_fingerprint: "sha256:7d7604342602d6be18a45b50e49c398e7d5a6e2e905a2702c5a11936e6d30303"
target_path: "C:\\Users\\joaov\\OneDrive\\Área de Trabalho\\Zenith Workspace\\src\\app\\page.tsx"
timestamp: 2026-10-01T06-59-32Z
slug: src-app-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser)

## Nota (Nielsen): 21/32 (66%, Aceitável); n/a: 7, 10
| # | Heurística | Nota | Principal problema |
|---|---|---|---|
| 1 | Visibilidade | 3 | Grade filtrada abaixo da dobra no desktop |
| 2 | Mundo real | 2 | Fotos desmentem tipo/capacidade; "1 clique" vs 3 campos; data cosmética |
| 3 | Controle | 2 | Limpar filtros não reseta o formulário |
| 4 | Consistência | 3 | Selects do hero sem seta |
| 5 | Prevenção | 3 | Duração cai 8 h → 2 h em silêncio às 20:00 |
| 6 | Reconhecimento | 3 | Modal não ecoa número de pessoas |
| 7 | Flexibilidade | n/a | Persuade |
| 8 | Estética | 3 | Passe de exemplo entre busca e resultados no mobile |
| 9 | Recuperação | 2 | Estado vazio sem alternativas; mensagem duplicada |
| 10 | Ajuda | n/a | Persuade |

## Especificidade: aprovada (por pouco)
Passe de reserva, artefatos no "Como funciona" e QR na confirmação são específicos; grade/passos/depoimentos seguem ritmo de template. Fotos contradizem "verificado".
Detector (navegador, injeção única por página): overused-font (procede), oversized-h1 desktop 72px (procede), image-hover-transform x5 (leve), gpt-thin-border-wide-shadow no passe (deliberado) e no menu mobile (falso positivo parcial), nested-cards x3 how-it-works (ilustração, baixa). CLI: 0. Sumiram: icon-tile-stack, dark-glow.

## Problemas prioritários
- [P1] Fotos desmentem "Verificado" (src/data/spaces.ts): trocar imagens/alts por tipo e capacidade. /impeccable clarify
- [P1] Formulário e grade dessincronizam após limpar (featured-spaces.tsx:61,78; search-bar.tsx:34). /impeccable harden
- [P2] Passagem busca → resultados fraca (mobile: passe no meio; desktop: abaixo da dobra). /impeccable layout
- [P2] Estado vazio sem alternativas calculadas; mensagem duplicada. /impeccable clarify
- [P2] Confirmação sem recibo (total, prazo de cancelamento, rastro após fechar; QR é ícone). /impeccable delight

## Personas
Jordan: selects sem seta; "Confirmada na hora" mais forte que "Exemplo"; "1 clique"; pessoas não ecoadas.
Riley: formulário x grade; duração silenciosa; data cosmética.
Casey: link pequeno + passe de tela cheia; menu sem Buscar; cancelamento abaixo da dobra.

## Menores
H1 genérico; cidades do rodapé como filtros; helper de funcionamento redundante; data MM/DD no headless; selo Verificado invariável.
