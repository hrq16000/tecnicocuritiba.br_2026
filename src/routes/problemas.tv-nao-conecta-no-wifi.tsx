import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTvNaoConectaWifi from "@/pages/problemas/TvNaoConectaWifi";

export const Route = createFileRoute("/problemas/tv-nao-conecta-no-wifi")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-nao-conecta-no-wifi",
    "title": "TV Não Conecta no Wi-Fi: O Que Fazer | Curitiba",
    "description": "Smart TV não conecta no Wi-Fi, some da lista de redes ou cai no meio do filme? Veja como separar cobertura do roteador, faixa de 5 GHz, sistema da TV e módulo sem.",
    "faq": [
      {
        "question": "Minha TV não acha a rede, mas o celular conecta no mesmo lugar. É defeito da televisão?",
        "answer": "É a hipótese mais provável, com uma ressalva importante: celulares enxergam 5 GHz e muitas televisões não. Antes de concluir que o módulo está em falha, confirme se a sua rede é de 2,4 GHz ou se o roteador está com as duas faixas no mesmo nome. Se a TV não enxerga nem a rede de 2,4 GHz, aí sim a suspeita vai para o módulo sem fio."
      },
      {
        "question": "A TV conecta e cai sozinha no meio do filme. O que costuma ser?",
        "answer": "Sinal chegando no limite é a causa mais comum, e o padrão típico é cair sempre nos mesmos horários, quando a vizinhança satura o canal. Economia de energia da própria televisão também derruba o rádio em pausas longas. Testar com o roteador mais próximo, mesmo que provisoriamente, confirma o cenário sem gastar nada."
      },
      {
        "question": "Aparece senha incorreta mesmo eu digitando certo. Por quê?",
        "answer": "Na maioria das vezes o perfil salvo na televisão está desatualizado depois de uma troca de senha ou de padrão de segurança no roteador. Esquecer a rede na TV e conectar de novo resolve. Vale também revisar caracteres especiais: alguns teclados de controle remoto trocam símbolos parecidos sem aviso."
      },
      {
        "question": "A TV conecta mas os aplicativos não abrem. É problema de internet?",
        "answer": "Normalmente não. Quando o aparelho conecta e os apps ficam carregando ou dão erro de servidor, os suspeitos são data e hora erradas e DNS travado. São ajustes de configuração e costumam ser resolvidos por orientação remota, sem visita e sem retirar o aparelho."
      },
      {
        "question": "Vale a pena usar um adaptador ou aparelho externo em vez de consertar?",
        "answer": "Em televisões antigas, sim, e falamos isso abertamente: um dispositivo externo de streaming custa menos que a troca de placa e ainda moderniza os aplicativos. Em televisões recentes, avaliar o módulo faz mais sentido. Damos essa leitura antes de qualquer coleta, para você escolher com o custo na mão."
      },
      {
        "question": "Restauração de fábrica resolve ou piora?",
        "answer": "Resolve alguns casos de perfil de rede inconsistente, mas não é o primeiro passo. Tente antes a opção de reset apenas de rede. E nunca faça restauração com uma atualização de sistema pela metade: essa combinação é uma das formas mais rápidas de deixar a televisão sem sistema e transformar um ajuste simples em serviço de bancada."
      },
      {
        "question": "Como funciona o atendimento?",
        "answer": "Não temos balcão de atendimento ao público. Fazemos retirada e devolução no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Problemas de cobertura e configuração de rede costumam ser tratados sem retirar a televisão."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTvNaoConectaWifi,
});
