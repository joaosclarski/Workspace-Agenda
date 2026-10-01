# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pessoas que precisam de um lugar profissional para trabalhar ou se reunir **por algumas horas**, sem manter um escritório:

- **Freelancers e autônomos:** trabalhar fora de casa com foco ou receber clientes em um ambiente que passe profissionalismo.
- **Equipes remotas e híbridas:** gestores que organizam encontros presenciais periódicos do time e precisam de uma sala com capacidade para todos, em um local acessível.
- **Pequenas empresas:** reuniões com clientes, entrevistas e treinamentos sem ter sede própria.

Ideia para o futuro (fora do escopo atual): **donos de espaços** anunciando suas salas na plataforma (lado da oferta). Nenhuma superfície fala com esse público hoje.

## Product Purpose

Plataforma de aluguel de salas de reunião e espaços de co-working **por hora**. O usuário busca por cidade, data e número de pessoas, reserva e faz o check-in na recepção com um QR Code. Sucesso é o visitante encontrar um espaço adequado e concluir a reserva com o mínimo de atrito.

## Positioning

Quatro mecanismos juntos, diferenciando a Zenith de redes de escritórios com planos e contratos (WeWork, Regus) e de soluções improvisadas (café + agenda):

1. **Pagamento só por hora:** sem contrato, mensalidade ou plano.
2. **Reserva instantânea:** confirmação na hora, sem aprovação manual do espaço.
3. **Check-in por QR Code:** chegar, mostrar o código na recepção e entrar.
4. **Espaços verificados:** curadoria de cada espaço; as fotos correspondem ao que o usuário encontra.

## Operating Context

- Fluxo: buscar (cidade, data, pessoas) → comparar espaços (foto, comodidades, capacidade, preço/hora) → escolher data, horário e duração → confirmar → receber código e QR Code → check-in na recepção.
- Tipos de espaço: sala de reunião, co-working (posição individual) e sala privativa.
- Comodidades usadas como critério de escolha: Wi-Fi 1Gbps, café cortesia, monitor 4K, lousa, videoconferência, estacionamento.
- Moeda BRL, idioma pt-BR, mercado brasileiro.

## Capabilities and Constraints

- v1 é uma **landing page** (Next.js App Router, TypeScript estrito, Tailwind CSS, Lucide React, Framer Motion), conforme `CLAUDE.md`.
- Busca e reserva são **simuladas** no navegador: não há back-end, disponibilidade real, pagamento, contas de usuário nem QR Code escaneável.
- Nesta máquina de desenvolvimento, o Windows bloqueia o compilador nativo do Next.js; os scripts usam `--webpack`.
- **Hipóteses de produto adotadas no protótipo (2026-10-01), a validar:** cancelamento grátis até 24 h antes do início; sem taxa de serviço; funcionamento das 8h às 22h em todos os espaços; "verificado" = fotos, internet e comodidades conferidas pessoalmente antes de o espaço entrar na plataforma.
- Em aberto: forma de pagamento, envio do código por e-mail, cidades reais de atuação e faixa de preço real.

## Brand Commitments

- Nome: **Zenith Workspace**.
- Não existe logo nem identidade visual oficial; o "Z" atual é um marcador provisório.

## Evidence on Hand

**O produto é um conceito: nada no site é fato real ainda.** Tudo o que aparece hoje é ilustrativo:

- Espaços, endereços, notas, número de avaliações e preços em `src/data/spaces.ts`.
- Depoimentos, nomes e cargos em `src/data/content.ts` (sinalizados na página como ilustrativos).
- Cidades (São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba).
- Fotos do Unsplash, que não são de espaços reais da plataforma.

Trabalhos futuros não devem apresentar esses itens como fatos, nem inventar clientes, métricas, imprensa ou parcerias.

## Product Principles

1. **Do clique à sala com o mínimo de atrito:** cada passo entre a busca e a confirmação precisa se justificar.
2. **Transparência antes da reserva:** preço por hora, total, capacidade e comodidades visíveis antes de confirmar; sem custos surpresa.
3. **Confiança pelo que é verificável:** fotos fiéis e informações concretas valem mais do que promessas.
4. **Flexibilidade é o produto:** nenhum compromisso além das horas reservadas.
