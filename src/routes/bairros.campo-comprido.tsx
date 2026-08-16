import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CampoComprido from "@/pages/bairros/CampoComprido";

export const Route = createFileRoute("/bairros/campo-comprido")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/campo-comprido",
    "title": "Técnico de Informática no Campo Comprido (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Campo Comprido, Curitiba: suporte a home office, formatação, upgrade de SSD e rede Wi-Fi em condomínio. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Minha internet cai só nas videochamadas. É problema do provedor?",
        "answer": "Nem sempre. Em prédios do Campo Comprido a causa mais comum é disputa de canal no Wi-Fi. Testamos a rede em uso real, separamos as faixas e só então avaliamos se o problema é do link do provedor."
      },
      {
        "question": "Vocês atendem dentro de condomínio?",
        "answer": "Sim. Combinamos horário e autorização na portaria durante a triagem, para evitar espera no acesso."
      },
      {
        "question": "Dá para configurar backup automático do trabalho?",
        "answer": "Sim. Configuramos backup em nuvem e/ou disco externo com rotina automática e testamos a restauração de um arquivo para comprovar que está funcionando."
      },
      {
        "question": "Meu notebook é da empresa. Vocês mexem?",
        "answer": "Só no que você tem autorização para alterar. Quando a mudança depende do TI da empresa, avisamos antes de qualquer intervenção."
      },
      {
        "question": "Quanto custa o atendimento no Campo Comprido?",
        "answer": "A partir de R$ 99,99 quando aplicável, com valor final apresentado após o diagnóstico e aprovado por você."
      }
    ]
  }),
  /* seo:auto-end */
  component: CampoComprido,
});
