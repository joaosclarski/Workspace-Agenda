import type { Step, Testimonial } from "@/types";

export const STEPS: Step[] = [
  {
    title: "Busque o espaço ideal",
    description: "Filtre por cidade, data e tamanho da equipe. Veja fotos, comodidades e preço por hora antes de decidir.",
  },
  {
    title: "Reserve com 1 clique",
    description: "Escolha início e duração e confirme. Sem contrato e sem mensalidade: você paga só pelas horas que usar.",
  },
  {
    title: "Faça o check-in por QR Code",
    description: "Na recepção, mostre o QR Code da sua reserva. O espaço já estará pronto quando você chegar.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Mariana Costa",
    role: "Designer freelancer",
    quote: "Reservo uma sala para apresentar projetos aos clientes. Passa uma imagem muito mais profissional do que uma chamada de casa.",
    rating: 5,
  },
  {
    name: "Rafael Almeida",
    role: "Gerente de Produto, Fintech",
    quote: "Nosso time é remoto e se encontra uma vez por semana. Em dois minutos achamos uma sala para dez pessoas perto de todo mundo.",
    rating: 5,
  },
  {
    name: "Juliana Ferreira",
    role: "Consultora de RH",
    quote: "O check-in por QR Code é rápido e a sala sempre está do jeito das fotos. Uso para entrevistas quase toda semana.",
    rating: 4,
  },
];
