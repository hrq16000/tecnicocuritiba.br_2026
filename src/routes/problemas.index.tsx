import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemasHub from "@/pages/problemas/ProblemasHub";

export const Route = createFileRoute("/problemas/")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas",
    "title": "Problemas de Computador, Notebook e TV | Curitiba",
    "description": "Índice de sintomas atendidos em Curitiba: computador lento, tela azul, Wi-Fi caindo, notebook que não liga e smart TV com defeito. Cada página explica causas prováveis, testes seguros e o que resolve, com avaliação técnica e coleta no endereço.",
    "faq": [
      {
        "question": "Como escolho a página certa para o meu caso?",
        "answer": "Escolha pelo comportamento do aparelho, não pela suspeita. Se o equipamento não dá sinal de vida, procure a página de não liga; se liga e a imagem não aparece, procure tela preta ou sem sinal; se tudo funciona devagar, procure lentidão. Sintoma descrito com precisão encurta o diagnóstico e evita troca de peça sem necessidade."
      },
      {
        "question": "Lentidão sempre é vírus?",
        "answer": "Não. Na maior parte dos casos que recebemos, lentidão vem de disco mecânico antigo, memória insuficiente para o uso atual ou aquecimento reduzindo a velocidade do processador. Infecção existe e aparece com propaganda, extensões estranhas e consumo alto sem programa aberto — nesse cenário a rota é a remoção de vírus, com verificação depois da limpeza."
      },
      {
        "question": "Posso tentar resolver sozinho antes de chamar alguém?",
        "answer": "Pode, e cada página lista os testes que não pioram o quadro: trocar cabo, testar outra tomada, reiniciar o roteador, conferir a saída de áudio selecionada. O que não recomendamos é abrir equipamento com suspeita de dano interno, tentar recuperar dados de disco com ruído mecânico ou instalar programas que prometem consertar tudo automaticamente."
      },
      {
        "question": "Vocês atendem no local ou levam o equipamento?",
        "answer": "Depende do sintoma. Cobertura de rede, configuração e ajuste de sistema são resolvidos no local ou remotamente. Falha de placa, tela, fonte e recuperação de dados são serviços de bancada, com retirada e devolução no endereço informado em Curitiba e região. Não temos balcão de atendimento ao público."
      },
      {
        "question": "Como funciona o custo do diagnóstico?",
        "answer": "A visita técnica inicial é sem compromisso e a coleta é gratuita nos serviços acima de uma hora de bancada. Para procedimentos de bancada existe um mínimo pré-aprovado de R$ 299,99, informado antes de qualquer execução. Você aprova o valor antes de o serviço começar; se não aprovar, o equipamento volta como estava."
      },
      {
        "question": "E quando o conserto não compensa?",
        "answer": "Dizemos isso abertamente. Em aparelhos antigos, o custo de placa ou painel pode passar do valor de mercado do equipamento, e nesses casos apontamos a alternativa mais barata — inclusive quando ela não envolve serviço nosso. Preferimos perder uma ordem de serviço a entregar um reparo que não se paga."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemasHub,
});
