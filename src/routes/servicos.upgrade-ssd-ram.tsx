import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/upgrade-ssd-ram")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/upgrade-ssd-ram",
    "title": "Instalação de SSD e Upgrade de Memória em Curitiba",
    "description": "Instalação de SSD e upgrade de memória RAM em Curitiba com avaliação de compatibilidade, clonagem e backup. Ganho real de desempenho, sem promessa de milagre.",
    "faq": [
      {
        "question": "SSD deixa qualquer computador rápido?",
        "answer": "Não é uma regra universal. O SSD elimina a espera do disco e muda muito a inicialização e a abertura de programas, mas quem limita a máquina pode ser o processador, a placa ou a quantidade de memória. Avaliamos a configuração antes de indicar a peça e dizemos quando o ganho será pequeno."
      },
      {
        "question": "Quantos gigabytes de memória eu preciso?",
        "answer": "Depende do uso e do que a placa aceita. Navegação, textos e vídeo pedem menos do que edição, planilhas grandes, máquinas virtuais ou muitas abas simultâneas. Verificamos o padrão suportado, o limite reconhecido pelo equipamento e dimensionamos junto com você, sem empurrar capacidade que não será aproveitada."
      },
      {
        "question": "É possível manter meus arquivos?",
        "answer": "Na maioria dos casos, sim. Quando o disco de origem é lido sem erro, o conteúdo é migrado por clonagem ou por cópia e restauração. Mesmo assim, recomendamos backup antes: qualquer trabalho sobre disco tem risco, e disco já em falha pode interromper a cópia."
      },
      {
        "question": "Clonagem é sempre recomendada?",
        "answer": "Não. A clonagem é confortável quando o sistema atual está saudável, porque preserva programas e configurações. Se o sistema já apresentava travamento, infecção ou anos de acúmulo, clonar leva o mesmo problema para dentro do SSD — nesse cenário a instalação limpa entrega um resultado melhor."
      },
      {
        "question": "Notebook aceita qualquer SSD?",
        "answer": "Não. É preciso confirmar o formato aceito pelo modelo (SATA 2,5 polegadas, M.2 SATA ou M.2 NVMe), se existe slot livre e se a placa reconhece o padrão. Também existem notebooks com armazenamento ou memória soldados, que limitam ou impedem o upgrade — isso é verificado antes de indicar qualquer peça."
      },
      {
        "question": "A peça está incluída?",
        "answer": "Não. Peças e componentes são informados separadamente da mão de obra, sempre com aprovação antes da compra. Você também pode fornecer o SSD ou a memória que já possui; nesse caso conferimos a compatibilidade antes de instalar."
      },
      {
        "question": "Vale a pena fazer upgrade em computador antigo?",
        "answer": "Às vezes, sim; às vezes, não. Em máquinas com plataforma muito defasada, o SSD melhora a resposta, mas o restante continua limitando o desempenho. Quando o valor do upgrade se aproxima do valor de um equipamento adequado, dizemos isso abertamente, e o critério está detalhado na página sobre quando não compensa reparar."
      },
      {
        "question": "SSD ou RAM: qual upgrade fazer primeiro?",
        "answer": "Quando o computador ainda usa HD mecânico, o SSD normalmente é o primeiro salto percebido: inicialização, abertura de programas e resposta do Windows deixam de esperar o disco. A RAM vem antes quando a máquina já tem SSD, mas trava ao alternar entre muitas abas, reuniões, planilhas ou programas. A escolha certa depende do gargalo medido no equipamento, não de uma regra de prateleira."
      },
      {
        "question": "SSD vale a pena em notebook?",
        "answer": "Vale quando o notebook aceita o formato compatível e o restante do conjunto ainda está saudável. O ganho mais claro aparece em aparelhos com HD mecânico lento. Antes de comprar, confirmamos a interface, o espaço físico, a saúde do disco atual e se a plataforma não tem outro defeito que limite o resultado."
      },
      {
        "question": "Qual a diferença real entre HD e SSD?",
        "answer": "O HD usa partes móveis e demora mais para localizar pequenos arquivos; o SSD usa memória flash e reduz essa espera. No dia a dia, isso aparece ao ligar, abrir programas e alternar tarefas. SSD SATA e NVMe têm desempenhos diferentes, mas o salto mais sentido pela maioria das pessoas é sair do HD para qualquer SSD compatível e confiável."
      },
      {
        "question": "O serviço possui garantia?",
        "answer": "A mão de obra segue as condições publicadas na página de preços e políticas, e a peça segue a garantia do fornecedor ou fabricante. Não existe garantia universal para qualquer falha futura do equipamento."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="upgrade-ssd-ram" />,
});
