# Design — Zenith Workspace

Guia visual da landing page. Descreve as decisões de design **como implementadas no código** (v1), para manter a consistência em novas telas e componentes.

## Princípios

- **Limpo e minimalista:** muito espaço em branco, poucos elementos por bloco, hierarquia clara.
- **Uma única cor de destaque:** o verde-azulado (`accent`) aparece só onde guia a atenção (selo Verificado, links, estados de sucesso, foco). As ações principais usam `ink` (quase preto).
- **Mostrar o produto, não descrevê-lo:** os diferenciais aparecem como artefatos (o passe de reserva, a conta horas × preço, o QR Code), não como adjetivos ou métricas.
- **Sem rótulo acima de título** (*eyebrow*/*kicker*): o título carrega a seção sozinho.
- **Superfícies suaves:** fundo off-white, cards brancos com bordas sutis, cantos bem arredondados e sombras leves.
- **Movimento discreto:** animações curtas e com mola, que dão retorno sem chamar atenção.

---

## Cores

Os tokens ficam em `src/app/globals.css` (bloco `@theme` do Tailwind v4) e viram classes utilitárias (`bg-canvas`, `text-muted`, `border-line`, `bg-accent-soft` etc.). Para mudar a identidade visual, basta editar esses valores.

| Token | Valor | Uso |
| --- | --- | --- |
| `canvas` | `#fafaf9` | Fundo da página |
| `surface` | `#ffffff` | Cards, modal, barra de busca, seção "Como funciona" |
| `ink` | `#1c1917` | Texto principal e botões primários |
| `muted` | `#78716c` | Texto secundário, rótulos, legendas |
| `line` | `#e7e5e4` | Bordas e divisórias |
| `accent` | `#0f766e` | Cor de destaque (verde-azulado) |
| `accent-strong` | `#115e59` | Variação mais escura do destaque (reservada) |
| `accent-soft` | `#f0fdfa` | Fundo de ícones, brilho do hero, ícone de sucesso |

Cores auxiliares da paleta padrão do Tailwind:

| Classe | Uso |
| --- | --- |
| `stone-800` | Hover do botão primário |
| `stone-50` / `stone-100` | Hover de campos e botões secundários, tags de comodidades, caixa de resumo de preço |
| `stone-700` | Texto das tags de comodidades |
| `stone-950/40` | Overlay do modal (com `backdrop-blur-sm`) |
| `amber-400` | Estrelas de avaliação (vazias em `stone-200`) |
| `teal-100`/`800`, `amber-100`/`800`, `sky-100`/`800` | Avatares de iniciais nos depoimentos (alternados) |

---

## Tipografia

- **Fonte:** [Geist](https://vercel.com/font), carregada via `next/font/google` e exposta como `--font-geist-sans` (`font-sans`), com `antialiased`.
- Títulos usam `font-semibold` + `tracking-tight` e `text-balance`; parágrafos usam `text-pretty`.

| Elemento | Classes | Tamanho (mobile → desktop) |
| --- | --- | --- |
| H1 (hero) | `text-[2.5rem] sm:text-6xl lg:text-7xl leading-[1.05] font-semibold tracking-[-0.035em]`, alinhado à esquerda | 40px → 60px → 72px |
| H2 (seções) | `text-3xl sm:text-5xl font-semibold tracking-[-0.03em]` | 30px → 48px |
| H3 (cards, passos) | `text-lg font-semibold tracking-tight` | 18px |
| H2 do modal | `text-xl font-semibold tracking-tight` | 20px |
| Subtítulo do hero | `text-lg sm:text-xl text-muted` | 18px → 20px |
| Descrição de seção | `text-lg text-muted` | 18px |
| Corpo / botões | `text-sm` / `text-base` | 14–16px |
| Rótulos e tags | `text-xs font-medium` | 12px |
| Preço no card / no passe | `text-2xl font-semibold tracking-tight`, valores com `tabular-nums` | 24px |
| Código da reserva | `font-mono text-sm tracking-widest` | 14px |

---

## Layout e espaçamento

- **Container:** `mx-auto max-w-6xl` (1152px) com `px-4 sm:px-6`.
- **Seções:** `py-20 sm:py-28`; âncoras com `scroll-mt-16` para não ficarem sob o header fixo.
- **Header:** `h-16`, `sticky`, fundo `canvas/80` com `backdrop-blur-md` e borda inferior.
- **Hero:** conteúdo centralizado (`max-w-3xl`), barra de busca em `max-w-4xl`, brilho radial em `accent-soft` no topo.
- **Grids:**
  - Espaços: 1 → 2 (`sm`) → 3 colunas (`lg`), `gap-6`.
  - Passos e depoimentos: 1 → 3 colunas (`md`).
- O "Como funciona" fica em uma faixa `bg-surface` com bordas em cima e embaixo, para quebrar o ritmo entre as seções em `canvas`.

### Breakpoints (padrão do Tailwind)

| Breakpoint | Largura | O que muda |
| --- | --- | --- |
| base | < 640px | Uma coluna; busca empilhada; modal como *bottom sheet*; navegação no menu (popover) |
| `min-[380px]` | ≥ 380px | Botão "Buscar" aparece no header ao lado do menu e leva à busca do hero (abaixo disso, o menu mantém as seções) |
| `sm` | ≥ 640px | Grid de espaços com 2 colunas; modal centralizado; tipografia maior |
| `md` | ≥ 768px | Links do header visíveis e menu mobile oculto; busca em linha com divisórias; passos e depoimentos em 3 colunas |
| `lg` | ≥ 1024px | Grid de espaços com 3 colunas |

---

## Bordas, raios e sombras

| Elemento | Raio |
| --- | --- |
| Cards, modal, barra de busca, depoimentos | `rounded-3xl` (24px) |
| Campos da busca, caixa de ícone dos passos, caixa de resumo | `rounded-2xl` (16px) |
| Botões, inputs do modal, logo | `rounded-xl` / `rounded-lg` |
| Tags, selos, avatares, badges numéricos | `rounded-full` |

| Elemento | Sombra |
| --- | --- |
| Barra de busca | `0 8px 30px rgb(0 0 0 / 0.06)` |
| Card de espaço (hover) | `0 12px 40px rgb(0 0 0 / 0.08)` |
| Modal | `shadow-xl` |

Bordas usam sempre `border-line` (1px). O QR Code da confirmação fica em uma caixa com borda tracejada (`border-dashed`).

---

## Componentes

### Botão (`src/components/ui/button.tsx`)
Base: `rounded-xl px-5 py-3 text-sm font-medium`, ícone com `gap-2`, foco visível em `accent`, estado desabilitado com `opacity-60`.

| Variante | Estilo | Uso |
| --- | --- | --- |
| `primary` (padrão) | `bg-ink text-white`, hover `stone-800` | Ações principais: Buscar, Reservar agora, Confirmar reserva |
| `secondary` | Fundo `surface`, borda `line`, hover `stone-50` | Ações de saída: Concluir |
| `ghost` | Só texto `muted`, hover `stone-100` | Ações terciárias (reservado) |

### Hero
Duas colunas a partir de `lg` (texto 1.2fr, passe 0.8fr) com a busca ocupando a largura toda embaixo. No mobile a ordem é texto → busca → passe, para a ação principal ficar perto do topo.

### Passe de reserva (`src/components/sections/booking-pass.tsx`)
Artefato-assinatura do produto, como um ingresso: card `rounded-3xl` com sombra longa e suave, picote tracejado com recortes semicirculares nas bordas, parte de cima com espaço, horário e a conta "2 h × R$ 65,00 = R$ 130,00", canhoto com QR Code e código. No desktop fica levemente inclinado (`lg:rotate-2`). Sempre rotulado "Exemplo de reserva" e montado com um espaço real dos dados.

### Barra de busca
Cápsula branca com três campos (ícone + rótulo pequeno + valor) separados por divisórias verticais no desktop. Cada campo ganha fundo `stone-50` em hover ou foco. O botão de busca ocupa a altura toda (`h-14` / `md:h-16`). A busca filtra a grade (estado compartilhado em `src/components/search-context.tsx`) e o resultado entra logo abaixo, rolando só o necessário para ficar visível.

### Card de espaço
Imagem 4:3 com dois selos em fundo branco translúcido: tipo (esquerda) e **Verificado** em `accent` com `BadgeCheck` (direita). Nome + nota com número de avaliações, linha de localização e capacidade em `muted`, tags de comodidades em pílulas `stone-100` com ícone, e rodapé com preço à esquerda e botão à direita (sempre alinhado à base do card).

### Estado vazio da grade
Caixa `rounded-3xl` com borda tracejada, título, motivo ("Nenhum espaço comporta 10 pessoas em Curitiba") e botão secundário "Ver todos os espaços".

### Modal (`src/components/ui/modal.tsx`)
Largura `max-w-md`, `p-6`, altura máxima de 90% da tela com rolagem. No mobile abre colado na base (`rounded-t-3xl`) com uma alça (`h-1.5 w-10 stone-300`) que fecha o modal ao ser arrastada para baixo; a partir de `sm`, centralizado e sem alça. Botão de fechar no canto superior direito.

### Modal de reserva
Cabeçalho com foto 64px do espaço. Duração como grupo de 4 botões de opção (rádios estilizados: selecionado em `ink`, indisponível com 40% de opacidade). Resumo em `stone-50` com horário, preço × horas, taxa e total; política de cancelamento logo abaixo do botão de confirmar. Na confirmação, "Adicionar ao calendário" (secundário, largura natural) ao lado de "Concluir" (primário).

### Menu mobile (`src/components/sections/mobile-menu.tsx`)
Botão de 44px com ícone `Menu` que abre um painel com a Popover API nativa (Esc e toque fora fecham sem JS). Painel fixo abaixo do header, `rounded-2xl`, links com 48px de altura. Escolher um link fecha o menu.

### Áreas de toque
Todo controle tem no mínimo 44×44px (`min-h-11` no botão, `h-11` nos links do header, `size-11` nos botões de ícone). Botões encolhem levemente ao toque (`motion-safe:active:scale-[0.98]`), já que telas de toque não têm hover. No card, se o preço e "Reservar agora" não cabem lado a lado, o botão desce e ocupa a largura toda (`flex-wrap` + `grow`), sem breakpoint fixo.

### Título de seção (`src/components/ui/section-heading.tsx`)
H2 + descrição opcional em `muted`, alinhados à esquerda, `max-w-2xl`. Sem rótulo acima.

### Passo do "Como funciona"
Painel `bg-canvas` de 144px de altura com o artefato real do passo em miniatura (cápsula de busca, linha de preço confirmada, canhoto com QR Code), seguido do número em `muted` e do título. Os artefatos são ilustração (`aria-hidden`); o texto do passo carrega a informação.

### Rodapé
Três colunas a partir de `lg`: marca + descrição + aviso de protótipo, navegação e cidades atendidas; linha de copyright separada por borda.

### Depoimento
Card com estrelas, citação entre aspas curvas, avatar circular de iniciais (44px) com cor alternada, nome em negrito e cargo em `muted`.

### Ícones
[Lucide React](https://lucide.dev). Tamanhos usuais: `size-4` (texto), `size-5` (busca, botões), `size-6`/`size-7` (destaques), `size-24` (QR Code). Ícones decorativos sempre com `aria-hidden`.

---

## Movimento

O movimento explica estado e dá retorno; só um momento é "autoral". Framer Motion só dentro do modal de reserva, que é carregado sob demanda (fora do JS inicial); o resto é CSS. Curva padrão de chegada: expo-out `cubic-bezier(0.16, 1, 0.3, 1)`, sem molas com rebote. Saídas são mais rápidas que entradas.

**Momento focal: QR Code do check-in.** Na confirmação, o QR Code é revelado de cima para baixo (`clip-path`, 0,7 s, expo-out, atraso 0,25 s) enquanto uma linha de leitura em `accent` desce junto com a borda revelada e some no fim. É o único efeito que fala do mecanismo do produto (check-in por QR Code); não deve ser repetido em outras partes da página.

| Interação | Animação |
| --- | --- |
| Hover no card de espaço | CSS: sobe 4px e ganha sombra (300 ms, expo-out) |
| Hover na imagem do card | CSS: zoom de 5% (500 ms, expo-out) |
| Abrir modal | Backdrop com fade em CSS (200 ms); painel vem de 24px abaixo e escala 0,98 → 1 (spring: stiffness 320, damping 28) |
| Fechar modal | Painel desce 16px com fade (150 ms, ease-in) |
| Formulário → confirmação | Formulário sai para a esquerda (16px, 0,2 s); confirmação entra pela direita (0,25 s) |
| Ícone de sucesso | Escala 0,8 → 1 com fade (0,4 s, expo-out) |
| QR Code | Revelação com linha de leitura (ver momento focal) |
| Resultado da busca | CSS: fade com deslocamento de 4px (200 ms) |
| Carregamentos | Ícone `Loader2` girando (`animate-spin`) |
| Âncoras | Rolagem suave (`scroll-behavior: smooth`) |

### Movimento reduzido

Com `prefers-reduced-motion: reduce`:

- `MotionConfig reducedMotion="user"` (no `BookingModal`) remove deslocamentos e escalas do Framer Motion, mas mantém os fades: abrir/fechar o modal e trocar de etapa continuam perceptíveis.
- O resultado da busca entra só com fade (utilitário CSS `animate-result-in`).
- Os hovers do card usam `motion-safe:` e deixam de mover; a sombra continua.
- O QR Code aparece só com fade, sem recorte nem linha de leitura.
- A rolagem suave é desativada. O spinner de carregamento continua, porque é retorno de estado.

---

## Imagens

- Fotos do Unsplash via `next/image`, com `fill` + `object-cover`, proporção 4:3 e `sizes` responsivo.
- Enquanto carregam, o fundo é `stone-100`.
- Toda imagem tem `alt` descritivo, definido nos dados (`imageAlt` em `src/data/spaces.ts`).
- Avatares usam iniciais coloridas em vez de fotos.

---

## Acessibilidade no design

- Foco visível (`outline` em `accent`) nos botões; campos destacam o fundo ou a borda no foco.
- Contraste: texto principal `ink` sobre `canvas`/`surface`; texto secundário em `muted`.
- Informações nunca dependem só de cor: estrelas têm rótulo textual e tags têm texto além do ícone.
- Detalhes de semântica e ARIA estão na seção de acessibilidade do [README](README.md#acessibilidade).
