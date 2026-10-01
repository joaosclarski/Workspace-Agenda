# Zenith Workspace

Landing page (v1) da **Zenith Workspace**, plataforma de aluguel de salas de reunião e espaços de co-working **por hora**. O visitante busca um espaço, vê os destaques, reserva em poucos cliques e recebe um QR Code para o check-in na recepção.

> Esta versão é uma landing page de demonstração: a busca e a reserva são **simuladas** no navegador, sem back-end.

---

## Funcionalidades

### 1. Hero com busca rápida
- Headline e subtítulo à esquerda; à direita, um **passe de reserva de exemplo** (horário, conta horas × preço por hora, QR Code de check-in) que mostra o produto na primeira tela.
- Barra de busca com **Localização** (cidades vindas dos dados), **Data** (padrão: hoje; datas passadas bloqueadas) e **Número de pessoas**.
- Ao buscar, a **grade de espaços é filtrada** (cidade e capacidade), o resultado aparece logo abaixo da busca ("1 espaço para 4 pessoas no Rio de Janeiro, em 1 de outubro") e a data escolhida já abre preenchida no modal de reserva. Sem resultados, há um atalho "Ver todos os espaços".

### 2. Espaços em destaque
- Grid responsivo (1 coluna no celular, 2 no tablet, 3 no desktop) com 6 espaços.
- Acima da grade, quando há busca: "Mostrando N de 6 · filtros · Limpar filtros".
- Cada card mostra foto, tipo do espaço, selo **Verificado**, nome, nota com número de avaliações, bairro/cidade, capacidade, tags de comodidades (Wi-Fi 1Gbps, Café cortesia, Monitor 4K, Lousa, Videoconferência, Estacionamento) e preço por hora.
- Efeito de hover: o card sobe levemente e a foto dá zoom.
- **Reservar agora** abre um modal com:
  - foto e dados do espaço;
  - data, horário de início e duração (1, 2, 4 ou 8 h), respeitando o funcionamento das 8h às 22h e bloqueando horários que já passaram hoje;
  - resumo em tempo real: intervalo (ex.: 10:00 – 14:00), preço × horas, taxa de serviço (grátis) e total, mais a política de cancelamento;
  - confirmação simulada → tela **"Reserva confirmada!"** com data, intervalo, endereço, QR Code de exemplo, código `ZW-XXXXX` e botão **Adicionar ao calendário** (arquivo .ics);
  - no celular, abre como *bottom sheet* que fecha arrastando a alça para baixo.

### 3. Como funciona
Três passos numerados, cada um ilustrado pelo artefato real daquele momento (busca, linha de preço confirmada, passe com QR Code):
1. Busque o espaço ideal
2. Reserve com 1 clique
3. Faça o check-in por QR Code na recepção

### 4. Depoimentos
Cards com nota em estrelas, citação, avatar com iniciais, nome e cargo (freelancer, gestor, consultora).

### Header e footer
Header fixo com fundo translúcido, links âncora para as seções (no celular, dentro de um menu) e botão "Buscar" que leva à busca do hero. Footer com navegação, cidades atendidas e aviso de protótipo.

---

## Stack

| Área | Tecnologia |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Linguagem | TypeScript (modo `strict` + `noUncheckedIndexedAccess`, sem `any`) |
| UI | React 19 |
| Estilização | Tailwind CSS v4 |
| Ícones | Lucide React |
| Animações | Framer Motion |
| Fonte | Geist (via `next/font/google`) |
| Imagens | `next/image` com fotos do Unsplash |

---

## Como rodar

**Requisitos:** Node.js 20+ (testado com Node 24) e npm.

```bash
npm install       # instala as dependências
npm run dev       # servidor de desenvolvimento em http://localhost:3000
```

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção (inclui checagem de tipos) |
| `npm run start` | Serve o build de produção |
| `npm run typecheck` | Roda só a checagem do TypeScript |

### Observação sobre Windows (`--webpack`)
Os scripts `dev` e `build` usam `--webpack` porque, nesta máquina, a política de **Controle de Aplicativos do Windows** bloqueia o binário nativo do compilador do Next.js (`@next/swc-win32-x64-msvc`). Sem ele o Turbopack não funciona, e o Next cai para os bindings WebAssembly, que só suportam Webpack.

Em um ambiente sem esse bloqueio (macOS, Linux ou Windows sem a política), é possível remover o `--webpack` dos scripts no `package.json` para usar o Turbopack.

---

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx          # HTML raiz, fonte Geist, metadados (SEO)
│   ├── page.tsx            # Monta a página com todas as seções
│   └── globals.css         # Tailwind + tokens de design (cores, fonte)
├── components/
│   ├── sections/
│   │   ├── header.tsx          # Navegação fixa
│   │   ├── hero.tsx            # Headline, subtítulo e números
│   │   ├── search-bar.tsx      # Busca rápida (client component)
│   │   ├── featured-spaces.tsx # Grid de espaços + estado do modal
│   │   ├── space-card.tsx      # Card de um espaço
│   │   ├── booking-modal.tsx   # Fluxo de reserva e confirmação
│   │   ├── how-it-works.tsx    # Os 3 passos
│   │   ├── testimonials.tsx    # Depoimentos
│   │   └── footer.tsx
│   └── ui/
│       ├── button.tsx          # Botão com variantes primary/secondary/ghost
│       ├── modal.tsx           # Modal acessível e animado
│       ├── section-heading.tsx # Título padrão das seções
│       └── star-rating.tsx     # Estrelas de avaliação
├── data/
│   ├── spaces.ts           # Espaços em destaque e lista de cidades
│   ├── amenities.ts        # Comodidades: rótulo + ícone
│   └── content.ts          # Passos do "Como funciona" e depoimentos
├── lib/
│   └── format.ts           # Moeda (BRL), datas e helper `cn` de classes
└── types/
    └── index.ts            # Tipos: Space, Amenity, Step, Testimonial, SearchQuery
```

Apenas os componentes interativos (`search-bar`, `featured-spaces`, `space-card`, `booking-modal`, `modal`) são client components (`"use client"`). O resto é renderizado no servidor, e a página é gerada como **estática** no build.

---

## Design

Visual limpo e minimalista, com uma única cor de destaque. Cores, tipografia, espaçamentos, componentes e animações estão documentados em **[DESIGN.md](DESIGN.md)**.

---

## Como editar o conteúdo

Todo o conteúdo fica em `src/data/`, sem textos espalhados pelos componentes:

- **Adicionar um espaço:** inclua um objeto em `SPACES` (`src/data/spaces.ts`). O TypeScript exige todos os campos do tipo `Space`. A cidade passa a aparecer automaticamente no filtro de busca.
- **Nova comodidade:** adicione a chave ao tipo `Amenity` (`src/types/index.ts`) e o rótulo/ícone em `AMENITIES` (`src/data/amenities.ts`); o compilador aponta se faltar algo.
- **Passos e depoimentos:** edite `STEPS` e `TESTIMONIALS` em `src/data/content.ts`.
- **Imagens:** são carregadas de `images.unsplash.com`, liberado em `next.config.ts`. Para usar outro domínio, adicione-o em `images.remotePatterns`; para imagens locais, coloque-as em `public/`.

---

## Acessibilidade

- HTML semântico: `header`, `nav`, `main`, `section` com `aria-labelledby`, listas ordenadas nos passos, `figure`/`blockquote` nos depoimentos.
- Modal com `<dialog>` nativo (`showModal()`): resto da página inerte, nome acessível vindo do título visível, fechamento com **Esc** ou clique fora, foco devolvido ao botão de origem e rolagem da página travada.
- Resultado da busca anunciado por leitores de tela (`aria-live`); ao confirmar a reserva, o foco vai para o título "Reserva confirmada!".
- Estrelas com rótulo textual ("Avaliação: 5 de 5 estrelas"); ícones decorativos com `aria-hidden`.
- Contorno de foco consistente em links, botões e campos (incluindo os campos da busca) e rolagem suave desativada para quem prefere menos movimento (`prefers-reduced-motion`).
- `lang="pt-BR"` no documento.

---

## Limitações da v1

- **Busca e reserva são simuladas**: não há API, banco de dados, pagamento nem autenticação. Os atrasos de carregamento são artificiais.
- O **QR Code** da confirmação é um ícone, marcado na página como exemplo; não é um código escaneável.
- Os depoimentos são **fictícios** e sinalizados na página como ilustrativos.
- Cancelamento grátis em 24 h, ausência de taxa e funcionamento das 8h às 22h são **hipóteses de produto** (ver `PRODUCT.md`), não políticas definidas.
- As fotos dependem de conexão com a internet (Unsplash).
- Não há testes automatizados.

## Próximos passos sugeridos

- Integrar com uma API real de disponibilidade e reservas.
- Gerar QR Codes reais na confirmação.
- Criar páginas de detalhe de cada espaço.
- Adicionar testes (componentes e fluxo de reserva).
