import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/montagem-de-pc")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/montagem-de-pc",
    "title": "Montagem de PC e PC Gamer em Curitiba | Testes Inclusos",
    "description": "Montagem e configuração de computadores em Curitiba: verificação de compatibilidade, instalação dos componentes, BIOS, sistema, drivers e testes antes da entrega.",
    "faq": [
      {
        "question": "Vocês montam PC com peças compradas pelo cliente?",
        "answer": "Sim, e é o cenário mais comum. Antes de agendar, conferimos a compatibilidade a partir dos modelos exatos que você comprou. No recebimento registramos o estado de cada item, incluindo acessórios e cabos que vieram na caixa. Peça com defeito de fábrica é acionada por você junto ao vendedor ou fabricante — a garantia do componente não é nossa."
      },
      {
        "question": "Vocês ajudam a verificar se as peças são compatíveis?",
        "answer": "Sim. Avaliamos socket e chipset entre processador e placa-mãe, geração e capacidade de memória suportadas, espaço físico do gabinete para cooler e placa de vídeo, conectores disponíveis para armazenamento e alimentação da GPU, além do consumo estimado do conjunto. Se algo não fecha, explicamos o que precisa mudar antes de você comprar."
      },
      {
        "question": "É possível montar um PC Gamer?",
        "answer": "É. Montamos desktops com placa de vídeo dedicada, incluindo configurações voltadas para jogos e criação de conteúdo. O que não fazemos é prometer quantidade de quadros por segundo, percentual de ganho ou ausência de gargalo: o desempenho depende do conjunto escolhido, do jogo, da resolução e das configurações usadas. Nosso compromisso é montagem correta, refrigeração adequada e estabilidade comprovada em teste."
      },
      {
        "question": "Vocês atualizam a BIOS?",
        "answer": "Somente quando existe motivo técnico, como suporte a um processador mais novo, e com a sua autorização registrada. A gravação de firmware tem risco real: uma interrupção de energia pode inutilizar a placa. Por isso trabalhamos com a versão estável publicada pelo fabricante e, em placas sem recurso de recuperação, não atualizamos sem o seu aceite expresso do risco."
      },
      {
        "question": "O sistema operacional está incluído?",
        "answer": "A instalação do sistema faz parte do serviço quando você solicita, mas a licença é fornecida ou adquirida por você. Instalamos apenas sistema legítimo e não realizamos ativação irregular. Se preferir receber a máquina apenas montada e testada, sem sistema, isso também é possível."
      },
      {
        "question": "Os drivers são instalados?",
        "answer": "Sim, sempre a partir dos pacotes oficiais do fabricante de cada componente: chipset, vídeo, áudio, rede e armazenamento. Evitamos instaladores genéricos de terceiros, que costumam ser a origem de instabilidade em máquinas recém-montadas."
      },
      {
        "question": "Vocês realizam testes antes da entrega?",
        "answer": "Sim, e informamos exatamente quais. Verificamos o reconhecimento de todos os componentes, inicialização repetida e partida a frio, teste de memória com ciclo definido, estado e leitura do armazenamento, temperatura sob carga controlada, estabilidade por período definido e o funcionamento de portas USB, áudio, vídeo e rede. Teste com duração limitada não substitui o uso prolongado, e dizemos isso abertamente."
      },
      {
        "question": "A garantia cobre defeito das peças?",
        "answer": "Não. A nossa garantia é de 90 dias sobre a mão de obra do serviço executado: instalação, fixação, conexões, organização interna e configuração entregue funcionando. Peças e componentes seguem a garantia do fornecedor ou fabricante. Também ficam fora da cobertura alterações feitas depois pelo usuário, overclock, uso inadequado e dano por oscilação elétrica."
      },
      {
        "question": "É possível aproveitar peças de outro computador?",
        "answer": "Em muitos casos sim, principalmente gabinete, fonte em bom estado, armazenamento e, dependendo da geração, memória. A verificação é individual: componente antigo pode limitar o conjunto ou simplesmente não ser compatível com a plataforma nova. Avaliamos e dizemos o que vale aproveitar e o que é melhor substituir."
      },
      {
        "question": "O valor pode ser informado antes de verificar a configuração?",
        "answer": "Não de forma fechada. O serviço varia com a quantidade e o estado das peças, a complexidade do gabinete, a solução de refrigeração, a instalação de sistema e drivers, a bateria de testes e a modalidade de atendimento. Depois da verificação da configuração, apresentamos o escopo e o valor por escrito — e nada é executado sem a sua aprovação."
      },
      {
        "question": "Vocês montam workstation para arquitetura, engenharia ou edição?",
        "answer": "Montamos e configuramos a máquina, com os mesmos critérios de compatibilidade, refrigeração e testes aplicados a qualquer desktop. O que precede a montagem é o levantamento de requisitos: quais programas você usa, o tamanho típico dos arquivos, se o trabalho é mais dependente de processador, memória ou placa de vídeo e quantos monitores serão ligados. A partir daí avaliamos a configuração — sem prometer tempo de renderização, fluidez ou desempenho em programa específico."
      },
      {
        "question": "Vocês garantem que o computador vai rodar bem um programa específico?",
        "answer": "Não garantimos desempenho por software. Trabalhamos com os requisitos publicados pelo fabricante do programa e com a certificação declarada pelo fabricante do componente, quando existe, e deixamos registrado que essas informações são de terceiros. Nossa garantia cobre a montagem, a configuração e a estabilidade comprovada em teste, não o comportamento de um programa em um projeto específico."
      },
      {
        "question": "Quantos monitores a máquina suporta?",
        "answer": "Depende das saídas de vídeo da placa instalada e da resolução usada em cada tela. Conferimos isso na avaliação da configuração e testamos as saídas antes da entrega. Se o número de monitores desejado não couber na placa escolhida, informamos antes da compra."
      },
      {
        "question": "Vocês montam workstation?",
        "answer": "Sim. Montamos e avaliamos estações de trabalho para cargas mais exigentes a partir de um levantamento de requisitos: programas utilizados, tamanho dos arquivos, aplicações simultâneas, quantidade e resolução de monitores, uso de processador, memória e placa de vídeo, armazenamento, necessidade de expansão, vida útil esperada e valor disponível. Não existe configuração universal."
      },
      {
        "question": "É possível garantir desempenho em um programa específico?",
        "answer": "Não. A montagem correta não garante desempenho específico em um programa. A configuração é definida a partir dos requisitos oficiais da aplicação, do tipo de projeto e do valor disponível. Não prometemos quadros por segundo, tempo de renderização nem resultado de teste comparativo sem medição real na sua máquina."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="montagem-de-pc" />,
});
