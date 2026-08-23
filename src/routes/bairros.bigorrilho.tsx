import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Bigorrilho from "@/pages/bairros/Bigorrilho";

export const Route = createFileRoute("/bairros/bigorrilho")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/bigorrilho",
    "title": "Técnico de Informática no Bigorrilho (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Bigorrilho e Champagnat, Curitiba: conserto de notebook, formatação, upgrade de SSD e Wi-Fi em apartamento.",
    "faq": [
      {
        "question": "Vocês atendem apartamento no Bigorrilho?",
        "answer": "Sim, é o perfil mais comum na região. Combinamos o horário pelo WhatsApp e o acesso é liberado na portaria. Serviços de software, rede e upgrades costumam ser resolvidos no próprio apartamento."
      },
      {
        "question": "O Wi-Fi cai no quarto que virei escritório. Tem solução?",
        "answer": "Na maioria dos apartamentos compridos o problema é posicionamento e canal do roteador, não velocidade contratada. Avaliamos a cobertura no local e indicamos ajuste, repetidor ou mesh conforme a planta."
      },
      {
        "question": "Preciso levar o notebook até algum endereço?",
        "answer": "Não. Não temos balcão ao público: ou o serviço é feito no seu endereço, ou fazemos coleta e entrega quando o caso exige bancada."
      },
      {
        "question": "Quanto custa o atendimento no Bigorrilho?",
        "answer": "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, e é sempre aprovado por você antes da execução."
      }
    ]
  }),
  /* seo:auto-end */
  component: Bigorrilho,
});
