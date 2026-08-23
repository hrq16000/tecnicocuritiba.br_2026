import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaComputadorDesligaSozinho from "@/pages/problemas/ComputadorDesligaSozinho";

export const Route = createFileRoute("/problemas/computador-desliga-sozinho")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/computador-desliga-sozinho",
    "title": "Computador Desliga Sozinho? Diagnóstico em Curitiba",
    "description": "Computador ou notebook que desliga sozinho, reinicia do nada ou apaga durante jogos: entenda a diferença entre temperatura, fonte, energia e software.",
    "faq": [
      {
        "question": "Computador que desliga sozinho é sempre superaquecimento?",
        "answer": "Não. Superaquecimento é a causa mais conhecida, mas responde por parte dos casos. Fonte sem capacidade para o pico de consumo, memória instável, armazenamento no fim da vida, mau contato interno e problema na rede elétrica do imóvel produzem exatamente o mesmo sintoma. Por isso a triagem começa perguntando como o equipamento apaga, e não presumindo temperatura."
      },
      {
        "question": "Qual a diferença entre desligar seco e reiniciar com aviso de erro?",
        "answer": "Desligamento seco significa que a alimentação foi cortada antes de o sistema conseguir registrar qualquer coisa — proteção térmica, fonte ou energia. Reinício com aviso indica que o sistema estava vivo e encontrou uma falha crítica, o que aponta para memória, driver ou armazenamento. São dois caminhos de investigação diferentes, e confundir os dois leva a troca de peça desnecessária."
      },
      {
        "question": "Trocar a fonte resolve?",
        "answer": "Resolve quando a fonte é comprovadamente a causa, e nesse cenário o resultado é imediato. O erro comum é trocar a fonte por dedução: se o problema era térmico ou de memória, o desligamento volta em poucos dias e você pagou por uma peça que não era necessária. Testamos o comportamento sob carga antes de indicar substituição."
      },
      {
        "question": "Meu notebook desliga sozinho. É a bateria?",
        "answer": "Pode ser, e há um teste que ajuda: se o equipamento se mantém estável ligado apenas na tomada e apaga quando depende da bateria, a suspeita é do conjunto de energia. Se apaga nas duas condições, a bateria deixa de ser a explicação principal e a investigação vai para temperatura, alimentação da placa e memória."
      },
      {
        "question": "Perco meus arquivos nesse tipo de reparo?",
        "answer": "O procedimento padrão não envolve apagar dados. Ainda assim, desligamento abrupto repetido é uma das situações que mais castigam o armazenamento, então tratamos o disco como item sensível desde o recebimento. Quando a leitura de saúde indica risco, avisamos antes de qualquer intervenção para você decidir sobre cópia de segurança."
      },
      {
        "question": "Continuar usando assim causa dano maior?",
        "answer": "Sim, e é um risco concreto. Cada corte abrupto interrompe escrita em andamento e aumenta a chance de corrupção do sistema e de setores defeituosos. Em falhas de alimentação, o uso insistente pode transformar um reparo pontual em dano espalhado pela placa. O mais barato quase sempre é diagnosticar cedo."
      },
      {
        "question": "Quanto tempo leva o diagnóstico?",
        "answer": "Falha intermitente exige tempo de observação: o equipamento precisa ser mantido em teste sob carga até o comportamento se repetir. Isso normalmente acontece dentro de alguns dias úteis, e o prazo é informado no recebimento. Não fechamos prazo por descrição de sintoma."
      },
      {
        "question": "Preciso levar o computador em algum endereço?",
        "answer": "Não atendemos em balcão. A triagem começa pelo WhatsApp, e o equipamento é retirado e devolvido no endereço combinado, nas condições publicadas na página de coleta e entrega. Casos que se resolvem sem bancada podem ser tratados na visita técnica."
      },
      {
        "question": "Qual a garantia do serviço?",
        "answer": "90 dias sobre a mão de obra do serviço executado, limitada ao defeito efetivamente tratado. Peças seguem a garantia do fornecedor. A cobertura não se estende a outra falha que apareça em etapa distinta do equipamento nem a dano por nova oscilação elétrica."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaComputadorDesligaSozinho,
});
