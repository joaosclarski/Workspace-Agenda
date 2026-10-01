# Constraints

Padrão de qualidade da Zenith Workspace. Este arquivo é a **fonte canônica**: `scripts/check.mjs` só espelha estas regras e lê daqui os valores de ratchet. Se os dois divergirem, este arquivo vence.

Última revisão: 2026-10-01 por joaovitorsclarski

## Como rodar

| Comando | Quando | O que roda | Tempo medido |
| --- | --- | --- | --- |
| `npm run check:fast` | Depois de cada edição | Tipos, lint, piso, segredos | ~6 s |
| `npm run check:task` | **Antes de dar qualquer tarefa como concluída** | `check:fast` + build + dependências + bundle + acessibilidade + performance | ~90 s (limite: 5 min) |
| `npm run check:full` | Revisão / futuro CI | Igual a `check:task` (ainda não há CI) | ~90 s |

**Política de falha:** o piso e os checks marcados **Bloqueia** retornam código de saída 1 e impedem a entrega. Os marcados **Avisa** aparecem no relatório (⚠) e devem ser corrigidos ou justificados na entrega, mas não travam. Relatórios completos ficam em `.constraints/reports/` (ignorado pelo git).

## Floor (sempre exigido)

- Nenhum comentário de supressão novo: `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `eslint-disable`, `istanbul ignore`, `c8 ignore`, `nosemgrep`, `gitleaks:allow`.
- Nenhum stub não implementado (`throw new Error("Not implemented")`) nem `catch {}` vazio.
- Nenhum teste pulado ou isolado (`.skip`, `.only`, `xit`) e nenhum teste apagado sem motivo registrado.
- Nenhum segredo no código-fonte.
- Nenhum `any` explícito (regra `@typescript-eslint/no-explicit-any` como erro), conforme o `CLAUDE.md`.
- **Este arquivo não é enfraquecido para fazer uma mudança passar.** Se um check falhar, corrija o código. Se a regra estiver errada, mude-a em um passo separado, com motivo, revisado por uma pessoa.

Verificado por `npm run check:fast` (etapa "Piso", varredura de `src/` e `scripts/`). Como o projeto ainda não é um repositório git, a varredura cobre os arquivos inteiros, não só o diff.

## Enforced with numbers

| Dimensão | Regra | Por que este número | Verificado por | Roda em | Falha |
| --- | --- | --- | --- | --- | --- |
| Tipos | Zero erros | TypeScript estrito é exigido pelo `CLAUDE.md` | `tsc --noEmit` | fast | Bloqueia |
| Lint | Zero erros e zero avisos | Avisos tolerados viram ruído que ninguém lê | `eslint . --max-warnings=0` (config `eslint-config-next` core-web-vitals + typescript) | fast | Bloqueia |
| Segredos | Zero achados | Qualquer segredo vazado é incidente; não há nível aceitável | `gitleaks dir . --redact --no-banner --config .gitleaks.toml --exit-code 1` | fast | Bloqueia |
| Build | Build de produção conclui | Um build quebrado invalida todas as medições seguintes | `next build --webpack` | task | Bloqueia |
| Segurança: dependências | Nenhuma vulnerabilidade alta ou crítica nas dependências de produção | Abaixo de "alta" é majoritariamente ruído | `npm audit --omit=dev --audit-level=high` (base de dados do GitHub Advisory) | task | Avisa |
| Acessibilidade | Zero violações *critical* ou *serious* (WCAG 2.1 AA) | Moderadas e leves costumam ser discutíveis; graves bloqueiam uso real | `axe http://localhost:3210 --tags wcag2a,wcag2aa,wcag21aa` | task | Avisa |
| Performance: LCP | ≤ 2500 ms (Lighthouse mobile, throttling simulado) | Limite "bom" das Core Web Vitals | `lighthouse http://localhost:3210 --only-categories=performance` | task | Avisa |
| Performance: CLS | ≤ 0,1 | Limite "bom" das Core Web Vitals | mesmo relatório do Lighthouse | task | Avisa |

Acessibilidade, dependências e performance usam fontes **externas** (WCAG via axe, banco de vulnerabilidades do GitHub, Chrome real via Lighthouse), que o agente não consegue fazer passar com código que não funciona. Os checks de acessibilidade e performance rodam contra `next start` na porta 3210, que o script sobe e derruba sozinho.

## Measured, not yet enforced

Ratchets: o valor de hoje é o piso. Piorar gera aviso; quando um número melhorar, atualize-o aqui no mesmo passo.

| Métrica | Hoje | Direção | Tolerância e motivo |
| --- | --- | --- | --- |
| Lighthouse performance (mobile) | 97 | não pode cair | 3 pontos: o score varia entre execuções na mesma máquina |
| JS total (gzip) | 338 | não pode crescer (kB) | 0,5%: absorve variações do build. Medido por `size-limit` sobre todos os chunks em `.next/static/chunks/` |

Os scripts leem estes valores pela primeira coluna; mantenha o nome da métrica exatamente igual.

Medido em 2026-10-01, sem regra atrelada:

- **LCP entre 2495 e 2868 ms** em duas execuções seguidas, ou seja, no limite de 2500. O check alterna entre ✔ e ⚠ por variação de medição. É o próximo ponto de performance a atacar.
- **axe:** 30 regras passando, 0 violações. 1 item *incomplete* (`color-contrast`) que o axe não consegue decidir sozinho (texto sobre gradiente/imagem); exige verificação manual.

## Exceptions

| ID | Regra | Caminho | Motivo | Dono | Expira |
| --- | --- | --- | --- | --- | --- |
| — | — | — | Nenhuma exceção ativa | — | — |

Toda exceção nova precisa de dono e de data de expiração de no máximo 90 dias (tempo para planejar a correção sem esquecê-la).

## Notas de ambiente

- **TypeScript fixado em 6.x:** o `typescript-eslint` ainda não suporta o TypeScript 7. Ao subir para 7, o lint precisa continuar funcionando.
- **`--webpack`:** o Windows desta máquina bloqueia o compilador nativo do Next.js (Turbopack). Veja o README.
- **gitleaks** foi instalado via `winget install Gitleaks.Gitleaks`. O script o encontra mesmo antes do PATH ser atualizado.
- **Sem git:** quando o projeto virar repositório, restrinja o piso e os scanners ao diff e passe a comparar este arquivo com o estado do branch base para detectar um padrão enfraquecido.
