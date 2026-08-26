// AUTO-CURADO — metadata estática por rota para prerender pré-hidratação.
// Fonte de verdade em runtime: componentes PageSEO/servicosCore/cidadesData (DOM hidratado).
// Este mapa espelha os títulos/descrições curados apenas para crawlers SEM JS
// (canonical/og:url por rota no HTML estático). Se um título de página mudar,
// atualize também esta lista rodando a captura em scripts/prerender-curated.
// NÃO adicionar rotas fora do manifesto curado (scripts/lib/curated-urls.mjs).
import { SERVICO_BAIRRO } from "./lib/curated-urls.mjs";
import { servicoBairroMeta } from "./lib/servico-bairro-meta.mjs";
import { WIFI_TV_BAIRRO_ROUTES } from "./lib/wifi-tv-bairro-meta.mjs";
import { priorityFaq } from "./lib/priority-faq.mjs";
import { priorityOffers } from "./lib/priority-offers.mjs";
import { servicoBlocos } from "./lib/servico-blocos.mjs";
import { servicoFaqs } from "./lib/servico-faqs.mjs";
import { cidadeFaqs } from "./lib/cidade-faqs.mjs";

const BASE_ROUTES = [
  {
    "path": "/",
    "title": "Técnico em Curitiba | Assistência Técnica e Suporte Local",
    "description": "Assistência técnica em Curitiba com diagnóstico honesto: atendimento a domicílio, remoto ou com coleta. Escolha o serviço e continue pelo WhatsApp."
  },
  {
    "path": "/servicos",
    "title": "Serviços de Informática em Curitiba | PC e Notebook",
    "description": "Conheça os serviços de formatação, manutenção de computadores e notebooks, SSD, vírus, recuperação de dados, Wi-Fi e suporte empresarial.",
    "faq": [
      {
        "question": "Como começa o atendimento e em quanto tempo tenho retorno?",
        "answer": "O atendimento começa por uma triagem no WhatsApp: você descreve o equipamento e o sintoma e recebe a orientação do próximo passo, que pode ser acesso remoto, visita ou coleta. O retorno depende da disponibilidade de agenda do dia, e informamos a janela real em vez de prometer prazo fixo."
      },
      {
        "question": "Vocês informam o valor antes de executar o serviço?",
        "answer": "Sim. Nenhum serviço é executado sem aprovação: o escopo e o valor são apresentados antes da execução. Peças e componentes são cobrados à parte da mão de obra e também dependem da sua autorização expressa."
      },
      {
        "question": "Qual serviço escolher se eu não sei qual é o problema?",
        "answer": "Não precisa saber. Descreva o sintoma na triagem e nós indicamos o caminho. Se preferir ler antes, as páginas de sintoma explicam os cenários mais comuns de notebook que não liga e de computador lento."
      },
      {
        "question": "O serviço pode ser feito remotamente ou precisa ser presencial?",
        "answer": "Depende da causa. Problemas de sistema, configuração, lentidão por software e suporte a home office costumam ser resolvidos por acesso remoto. Falhas de hardware, tela, energia e reparo de placa exigem atendimento presencial ou coleta para bancada."
      },
      {
        "question": "Atendem empresas e não apenas usuários domésticos?",
        "answer": "Sim. Além dos serviços para uso doméstico, atendemos empresas com suporte técnico, manutenção preventiva, redes e Wi-Fi corporativo e rotinas de backup, de forma pontual ou recorrente."
      },
      {
        "question": "Existe garantia do serviço executado?",
        "answer": "Sim. A mão de obra do serviço executado tem 90 dias de garantia no mesmo defeito tratado, e peças seguem a garantia do fornecedor ou fabricante. Nota fiscal de serviço é emitida mediante solicitação."
      }
    ]
  },

  {
    "path": "/servicos/formatacao",
    "title": "Formatação de PC e Notebook em Curitiba | Windows",
    "description": "Formatação de PC e notebook em Curitiba com backup, Windows original, drivers e programas essenciais. Diagnóstico a partir de R$ 99,99. Atendimento via WhatsApp."
  },
  {
    "path": "/servicos/manutencao-de-notebook",
    "title": "Assistência Técnica de Notebook em Curitiba | Diagnóstico",
    "description": "Assistência técnica de notebook em Curitiba: lentidão, aquecimento, tela, teclado, bateria e limpeza interna. Todas as marcas."
  },
  {
    "path": "/servicos/manutencao-de-computador",
    "title": "Assistência Técnica de Computador em Curitiba | PC",
    "description": "Assistência técnica de computador em Curitiba: travamentos, fonte, memória, HD/SSD e placa-mãe. Casa e empresa."
  },
  {
    "path": "/servicos/upgrade-ssd-ram",
    "title": "Instalação de SSD e Upgrade de Memória em Curitiba",
    "description": "Instalação de SSD e upgrade de memória RAM em Curitiba com avaliação de compatibilidade, clonagem e backup. Ganho real de desempenho, sem promessa de milagre."
  },
  {
    "path": "/servicos/remocao-de-virus",
    "title": "Remoção de Vírus e Malware em Curitiba | PC e Notebook",
    "description": "Remoção de vírus, malware e sequestro de navegador em Curitiba. Limpeza segura, proteção dos seus dados e reinstalação quando necessário. Atendimento via WhatsApp."
  },
  {
    "path": "/servicos/recuperacao-de-dados",
    "title": "Recuperação de Dados em Curitiba | HD, SSD e Pendrive",
    "description": "Recuperação de dados em Curitiba de HD, SSD, pendrive e cartão. Exclusão acidental, sistema que não inicia e falhas."
  },
  {
    "path": "/servicos/redes-e-wifi",
    "title": "Configuração de Redes e Wi-Fi em Curitiba | Roteadores",
    "description": "Configuração de redes e Wi-Fi em Curitiba: internet instável, roteador, repetidor, cabeamento e rede empresarial. Cobertura melhor em casa e no trabalho."
  },
  {
    "path": "/servicos/suporte-tecnico-empresarial",
    "title": "Suporte Técnico para Empresas em Curitiba | Informática",
    "description": "Suporte técnico de informática para empresas em Curitiba, com atendimento para computadores, usuários, redes, impressoras e manutenção preventiva."
  },
  {
    "path": "/servicos/manutencao-preventiva-empresas",
    "title": "Manutenção Preventiva de Computadores em Curitiba | Empresas",
    "description": "Manutenção preventiva de computadores para empresas em Curitiba: inventário, inspeção, armazenamento, atualizações e relatório de riscos priorizado, sem promessa."
  },
  {
    "path": "/servicos/backup-para-empresas",
    "title": "Backup para Empresas em Curitiba | Proteção de Arquivos",
    "description": "Backup para empresas em Curitiba: avaliação do que existe hoje, cópia local, cópia externa, nuvem, retenção, versionamento e teste de restauração."
  },
  {
    "path": "/servicos/conserto-tv",
    "title": "Conserto de TV e Smart TV em Curitiba | Bancada e Coleta",
    "description": "Conserto de TV LED, LCD e Smart TV em Curitiba: avaliação em bancada, reparo em nível de componente quando viável, coleta e entrega."
  },
  {
    "path": "/servicos/conserto-placa",
    "title": "Reparo de Placa Eletrônica em Curitiba | Nível de Componente",
    "description": "Reparo de placa-mãe de notebook, placa de PC e placa de TV em Curitiba: avaliação em bancada, reparo em nível de componente, retrabalho de BGA quando viável, coleta."
  },
  {
    "path": "/servicos/conserto-monitor",
    "title": "Conserto de Monitor em Curitiba | Bancada, Coleta e Entrega",
    "description": "Conserto de monitor em Curitiba: avaliação em bancada, reparo de fonte, placa e backlight quando viável, coleta e entrega."
  },
  {
    "path": "/servicos/montagem-de-pc",
    "title": "Montagem de PC e PC Gamer em Curitiba | Testes Inclusos",
    "description": "Montagem e configuração de computadores em Curitiba: verificação de compatibilidade, instalação dos componentes, BIOS, sistema, drivers e testes antes da entrega.",
    "blocos": [
      {
        "titulo": "Peças fornecidas pelo cliente: compatibilidade, procedência e troca",
        "paragrafos": [
          "Antes de agendar a montagem conferimos a compatibilidade declarada a partir dos modelos exatos informados por você. No recebimento registramos o estado de cada item, incluindo acessórios, parafusos e cabos ausentes, tanto para peça lacrada quanto para peça usada. Dano prévio identificado, como pino torto, conector quebrado ou oxidação, é fotografado e comunicado antes de qualquer instalação.",
          "Procedência conta: pedimos a nota ou o comprovante de compra da peça. Sem comprovante, a montagem pode ser feita, mas o componente entra como item sem garantia rastreável e isso fica registrado no atendimento. Peça com defeito de fábrica é acionada por você junto ao vendedor ou fabricante: a garantia do componente não é nossa e o prazo de troca é o do próprio fornecedor, não um prazo criado por nós. Componente usado ou fora de garantia só é montado com o seu aceite registrado do risco de falha. Se uma peça incompatível inviabilizar a montagem, cobramos apenas o que já foi executado e explicamos a troca necessária.",
          "Quando uma peça sua falha no teste, paramos a montagem e comunicamos o resultado. O equipamento fica aguardando a sua substituição por até 5 dias úteis sem custo de permanência; passado esse prazo, combinamos a devolução do conjunto ou a continuidade do atendimento.",

          "Peças adquiridas a pedido só são compradas após a sua autorização expressa do item, do valor e do fornecedor. Mão de obra e peça permanecem separadas no registro do atendimento, e a substituição ou devolução segue a regra do fornecedor."
        ]
      },
      {
        "titulo": "Checklist de BIOS/UEFI, drivers oficiais e testes finais",
        "paragrafos": [
          "A configuração de BIOS/UEFI faz parte da montagem: ordem de inicialização, reconhecimento do armazenamento e perfil de memória quando oficialmente suportado. Atualização de firmware não é rotina; acontece somente quando há motivo técnico e com autorização registrada, usando a versão estável do fabricante. Em placa sem recurso de recuperação, informamos o risco e não executamos sem aceite por escrito. Não realizamos overclock nem modificação não oficial de firmware.",
          "Os drivers vêm sempre dos pacotes oficiais do fabricante de cada componente — chipset, vídeo, áudio, rede e armazenamento. Instalador genérico de terceiros costuma ser a origem de instabilidade em máquina recém-montada e por isso não é utilizado.",
          "O checklist de entrega inclui reconhecimento de todos os componentes instalados, inicialização repetida com partida a frio, teste de memória com ciclo definido, verificação do estado e da leitura do armazenamento, carga controlada de processador e placa de vídeo com acompanhamento de temperatura, estabilidade por período definido e checagem de portas USB, áudio, vídeo e rede. Teste com duração definida não substitui uso prolongado, e não prometemos número de quadros por segundo nem percentual de ganho."
        ]
      },
      {
        "titulo": "Garantia da montagem, da configuração e da peça",
        "paragrafos": [
          "A garantia da montagem cobre a mão de obra do que executamos: instalação, fixação, conexões e organização interna. A garantia da configuração cobre BIOS, sistema e drivers entregues funcionando; alterações feitas depois pelo usuário saem da cobertura.",
          "A garantia da peça é sempre do fabricante ou fornecedor, com prazo e canal definidos por ele, acionada com a nota correspondente. Ficam fora da cobertura defeito posterior sem relação com a montagem, alteração feita pelo cliente, overclock, uso inadequado, surto elétrico e dano físico."
        ]
      }
    ]
  },

  {
    "path": "/servicos/suporte-home-office",
    "title": "Suporte Técnico para Home Office em Curitiba",
    "description": "Suporte técnico para quem trabalha em casa em Curitiba: computador lento, Wi-Fi instável, câmera e microfone em reuniões, e-mail, arquivos e preparação do posto."
  },
  {
    "path": "/politica-de-pecas-do-cliente",
    "title": "Política de Peças do Cliente | Montagem em Curitiba",
    "description": "Regras claras para peças fornecidas pelo cliente em Curitiba: compatibilidade, procedência, integridade no recebimento, prazo de troca, garantia da peça x garantia.",
    "blocos": [
      {
        "titulo": "Compatibilidade conferida antes da montagem",
        "paragrafos": [
          "A maior parte dos problemas em montagem com peça do cliente não aparece na bancada: aparece na compra. Memória que a placa não suporta, cooler que não cabe no gabinete, fonte com conector diferente do que a placa de vídeo exige. Por isso a conferência acontece antes do agendamento, com base nos modelos exatos informados por você e no que o fabricante publica sobre cada componente.",
          "Memória depende do suporte da placa e do processador, e o perfil de desempenho só é ativado quando oficialmente suportado. Placa de vídeo e refrigeração dependem das medidas internas reais do gabinete. A fonte é avaliada pelo consumo estimado dos componentes declarados: potência nominal alta não substitui qualidade de fabricação. Processador novo em placa antiga pode exigir atualização de firmware, feita apenas com motivo técnico e autorização registrada."
        ]
      },
      {
        "titulo": "Procedência: o comprovante é o que garante a sua peça",
        "paragrafos": [
          "Procedência conta. Pedimos a nota fiscal ou o comprovante de compra de cada peça porque é ele que permite acionar a garantia do fabricante depois. Sem comprovante a montagem pode ser feita mesmo assim, mas o componente entra como item sem garantia rastreável e isso fica registrado no atendimento.",
          "Peça usada, recondicionada ou vinda de marketplace é aceita, com registro de estado e o seu aceite do risco de falha. Não avaliamos autenticidade de marca nem emitimos laudo de falsificação: registramos divergências visíveis entre embalagem e componente."
        ]
      },
      {
        "titulo": "Integridade no recebimento e prazo de troca",
        "paragrafos": [
          "Todo componente é conferido no recebimento: lacre, embalagem, acessórios, parafusos e cabos. Dano prévio visível — pino torto no soquete, conector quebrado, oxidação, dissipador solto — é fotografado e comunicado antes de qualquer instalação, e a peça só é instalada com o seu aceite explícito.",
          "Quando uma peça sua falha nos testes, a montagem para e o resultado é comunicado na hora. O conjunto fica aguardando a sua substituição por até 5 dias úteis sem custo de permanência; passado esse prazo, combinamos a devolução no estado ou a continuidade do atendimento. O prazo de troca junto ao vendedor é dele e não temos controle sobre esse tempo. Se a incompatibilidade inviabilizar a montagem, cobramos apenas o que já foi executado."
        ]
      },
      {
        "titulo": "Garantia da peça x garantia da mão de obra",
        "paragrafos": [
          "São coberturas separadas, com responsáveis diferentes. A garantia da peça é do fabricante ou fornecedor, com prazo e canal definidos por ele e acionada com a nota correspondente. A garantia da mão de obra cobre a instalação, a fixação, as conexões, a organização interna e a configuração de BIOS, sistema e drivers entregues funcionando.",
          "Ficam fora da cobertura defeito posterior sem relação com a montagem, alteração feita pelo cliente, overclock, uso inadequado, surto elétrico e dano físico. Não realizamos overclock nem modificação de BIOS não oficial, e não prometemos resultado de desempenho em jogos ou aplicativos."
        ]
      },
      {
        "titulo": "Valor declarado do equipamento",
        "paragrafos": [
          "Muita gente precisa informar um valor do equipamento para seguro, transporte, registro interno de empresa ou venda no estado. Esse valor é sempre declarado pelo proprietário. Componentes eletrônicos e de informática — placas, processadores, memórias, armazenamento, fontes, equipamento de som e periféricos — perdem valor de mercado com rapidez, mesmo funcionando perfeitamente.",
          "Ao declarar um valor, fica registrado o entendimento de que, em caso de sinistro, dano, indenização ou venda no estado, o valor apurado por avaliação técnica, perícia ou seguradora pode ser significativamente inferior ao declarado, inclusive abaixo de um terço dele, porque a apuração considera idade, estado físico, comprovação de origem, existência de garantia ativa e demanda real do modelo. Não emitimos laudo pericial nem avaliação para seguradora: fornecemos o registro descritivo do estado do equipamento no atendimento."
        ]
      }
    ]
  },
  {
    "path": "/seguranca-dos-dados",
    "title": "Segurança dos Dados na Assistência Técnica | Curitiba",
    "description": "Como arquivos, senhas e acessos são tratados durante a assistência técnica em Curitiba: autorização, acesso mínimo, backup prévio, cópias temporárias, limites.",
    "blocos": [
      {
        "titulo": "Compromisso de acesso mínimo",
        "paragrafos": [
          "O princípio que organiza tudo aqui é simples: o acesso acompanha o serviço, nunca o contrário. Se o atendimento é uma configuração de rede, não há motivo para abrir pastas pessoais. Se o serviço é uma formatação com cópia dos arquivos, a manipulação das pastas de dados é parte inevitável do trabalho — e é explicada antes de começar.",
          "Essa distinção importa porque promessas absolutas costumam ser falsas. Dizer que nenhum arquivo será visualizado em um serviço que exige localizar e copiar arquivos seria conveniente, mas não seria verdade. Preferimos descrever o que realmente acontece e deixar a decisão com você.",
          "Nenhuma intervenção em equipamento ou armazenamento é totalmente livre de risco para os dados. Discos já em falha podem piorar durante a leitura, e sistemas corrompidos podem impedir a cópia de parte do conteúdo."
        ]
      },
      {
        "titulo": "Autorização e backup antes do atendimento",
        "paragrafos": [
          "Todo atendimento segue a mesma ordem: diagnóstico, explicação do que foi encontrado, valor do serviço e somente então execução. Etapas que alteram o conteúdo do equipamento — formatar, reinstalar sistema, apagar partição, trocar armazenamento, remover programas — dependem da sua autorização registrada na conversa da triagem. Em equipamentos de empresa, a autorização vem de quem responde pela organização.",
          "Sempre que possível, mantenha uma cópia atualizada dos seus arquivos antes de qualquer serviço técnico. Uma cópia útil segue três regras práticas: estar fora do computador de origem, ter sido feita recentemente e já ter sido aberta ao menos uma vez para conferir que os arquivos abrem de verdade. Backup que ninguém testou é apenas uma expectativa."
        ]
      },
      {
        "titulo": "Senhas, credenciais e atendimento remoto",
        "paragrafos": [
          "Senhas bancárias, códigos de autenticação e credenciais sensíveis não devem ser enviados por mensagem — nem para nós. Quando o serviço exige a senha do próprio computador, ela deve ser informada apenas no momento do atendimento e pode ser alterada depois. Não solicitamos código recebido por SMS, aplicativo autenticador ou e-mail, nem dados de cartão ou pagamento durante uma sessão de acesso remoto.",
          "O acesso remoto só acontece com autorização explícita e enquanto você acompanha a tela, com programa de fonte legítima indicada no atendimento. A sessão é encerrada ao final e, se o programa não for mais necessário, orientamos a remoção."
        ]
      },
      {
        "titulo": "Formatação, recuperação e cópias temporárias",
        "paragrafos": [
          "Na formatação, a sequência é sempre a mesma: localizar os dados, copiar o que for possível, confirmar com você o que foi copiado, reinstalar o sistema e devolver os arquivos. O que estiver fora das pastas indicadas por você pode passar despercebido — por isso a conferência da lista antes de formatar é uma etapa, não uma formalidade.",
          "Na recuperação de dados, o material lido é gravado em uma área temporária até a entrega. Essa cópia existe pelo tempo necessário para você conferir o resultado e recebê-la; depois da validação, é descartada, salvo combinação diferente registrada no atendimento. Em equipamentos empresariais, a entrega é feita para a pessoa autorizada pela empresa."
        ]
      },
      {
        "titulo": "Limites técnicos e responsabilidade compartilhada",
        "paragrafos": [
          "Disco com falha mecânica ou eletrônica pode piorar durante a própria tentativa de leitura; conteúdo criptografado sem a chave correta não é acessível por caminho legítimo; equipamento bloqueado por conta do fabricante depende do titular da conta. Não somos empresa de cibersegurança, perícia digital ou auditoria de conformidade, e não existe garantia contra vazamento, invasão ou perda causada por fatores fora do atendimento.",
          "Do lado do técnico: acessar apenas o necessário, explicar o risco antes da etapa, executar somente o que foi autorizado e descartar cópias temporárias após a entrega. Do lado do cliente: manter backup próprio sempre que possível, indicar onde estão os arquivos importantes, informar se há conteúdo sensível, não enviar senhas por mensagem e conferir o resultado antes de encerrar o atendimento."
        ]
      }
    ],
    "faq": [
      {
        "pergunta": "O técnico precisa acessar meus arquivos?",
        "resposta": "Depende do serviço. Backup, formatação e recuperação de dados exigem localizar e manipular pastas de arquivos. Ajuste de rede, instalação de programa ou configuração de impressora normalmente não exigem. O acesso é sempre limitado ao necessário para executar o que foi combinado."
      },
      {
        "pergunta": "Preciso informar minhas senhas?",
        "resposta": "Apenas a senha do próprio equipamento ou da conta local, quando o serviço não puder ser executado sem ela. Senhas de banco, códigos de autenticação em duas etapas e credenciais sensíveis não devem ser enviados por mensagem nem informados durante o atendimento."
      },
      {
        "pergunta": "Meus arquivos podem ser apagados?",
        "resposta": "Procedimentos como formatação apagam o conteúdo do disco por definição, e por isso a cópia prévia é feita antes, com a sua autorização. Em discos já com falha, parte do conteúdo pode não ser legível. Nenhuma intervenção é totalmente livre de risco para os dados."
      },
      {
        "pergunta": "É obrigatório fazer backup antes do atendimento?",
        "resposta": "Não é uma exigência formal, mas é a recomendação técnica. Sempre que possível, mantenha uma cópia atualizada dos arquivos importantes antes de entregar ou liberar o equipamento. A cópia que fazemos durante o serviço depende do estado do armazenamento."
      },
      {
        "pergunta": "Como funciona o acesso remoto?",
        "resposta": "Com programa de fonte legítima, autorização explícita e você acompanhando a sessão na tela do próprio computador. O acesso é encerrado ao final do atendimento e nenhuma solicitação financeira é feita durante a sessão."
      },
      {
        "pergunta": "Arquivos recuperados ficam armazenados com vocês?",
        "resposta": "Cópias temporárias criadas durante o serviço existem apenas pelo tempo necessário para a entrega e a conferência do resultado. Depois da validação com você, essas cópias são descartadas, salvo combinação diferente registrada no atendimento."
      },
      {
        "pergunta": "O serviço garante que não haverá perda de dados?",
        "resposta": "Não. Nenhum serviço técnico honesto pode prometer proteção absoluta ou ausência total de risco. O que garantimos é o cuidado no procedimento, a informação antecipada sobre o risco de cada etapa e a decisão sempre nas suas mãos."
      },
      {
        "pergunta": "Como são tratados dados de empresas?",
        "resposta": "Com o mesmo princípio de acesso mínimo, acrescido da definição de quem autoriza o quê. Em ambiente corporativo, alterações em contas, políticas e sistemas dependem da autorização de quem responde pela empresa, e não do usuário do equipamento."
      }
    ]
  },
  {
    "path": "/sobre",
    "title": "Sobre o Técnico em Curitiba | PC, Notebook e Redes",
    "description": "Conheça o Técnico em Curitiba: foco em informática, notebook, PC, redes e suporte empresarial em Curitiba e região, com diagnóstico honesto e valor transparente.",
    "blocos": [
      {
        "titulo": "Quem somos e o que atendemos",
        "paragrafos": [
          "O Técnico em Curitiba é um serviço de assistência técnica em informática voltado a residências, profissionais liberais e empresas de Curitiba e região metropolitana. A proposta é simples: você fala direto com quem entende do problema, entende o que está acontecendo com o equipamento e decide com clareza.",
          "O trabalho começa pela triagem no WhatsApp e segue por diagnóstico, orientação, valor do atendimento e execução — sempre nessa ordem. Casos simples podem ser resolvidos em atendimento a domicílio; reparos que exigem bancada seguem para a oficina com o seu acompanhamento.",
          "O foco é informática: notebooks, computadores de mesa, formatação e sistema, upgrade de SSD e memória, remoção de vírus, recuperação de dados, redes e Wi-Fi e suporte empresarial. Nada de dispersar em áreas fora dessa competência."
        ]
      },
      {
        "titulo": "Como trabalhamos e o que não prometemos",
        "paragrafos": [
          "Triagem por WhatsApp, diagnóstico primeiro, valor aprovado por você e garantia sobre o serviço executado: essa é a sequência de qualquer atendimento. Nada é executado sem a sua aprovação, e as condições de garantia são explicadas caso a caso.",
          "Transparência também é dizer o que não fazemos. Não prometemos preço fechado universal por telefone, porque o valor depende da avaliação real. Não garantimos recuperação de dados: é sempre uma tentativa que depende do estado da mídia. Não garantimos tempo fixo de chegada, já que horário e logística são combinados conforme a agenda.",
          "Também não usamos avaliações falsas, número de estrelas inventado nem depoimentos fictícios, e não mantemos equipe fixa ou endereço comercial anunciado em cada cidade. Preferimos ser honestos a criar expectativa falsa."
        ]
      },

      {
        "titulo": "Por que diagnosticamos antes de falar em peça",
        "paragrafos": [
          "A maior parte do prejuízo em assistência técnica não vem do conserto caro: vem do conserto errado. Formatar uma máquina cujo gargalo era o disco mecânico, trocar memória quando o problema era temperatura, comprar fonte nova quando o defeito estava no botão. Em todos esses casos o cliente paga, a melhora é curta e o sintoma volta. Por isso a nossa ordem é fixa: entender, confirmar, informar e só então executar.",
          "O diagnóstico segue eliminação por etapas. Primeiro confirmamos se há energia chegando, depois se o equipamento inicializa, em seguida se há imagem e se o sistema carrega. Cada etapa descartada reduz hipóteses e evita a troca de componente por suposição. Quando o comportamento é intermitente, testamos sob uso real em vez de confiar apenas em um teste rápido de bancada.",
          "Também tratamos sintoma e serviço como coisas diferentes. Quem chega dizendo que o computador está lento ou que o notebook não liga está descrevendo um efeito, não uma causa. Traduzir esse efeito em causa provável é justamente o trabalho técnico — e é o que separa uma indicação honesta de uma venda de peça."
        ]
      },
      {
        "titulo": "Experiência acumulada e limites do escopo",
        "paragrafos": [
          "A atuação em informática vem desde 1998, período em que o equipamento do dia a dia deixou de ser o desktop de escritório e passou a incluir notebooks finos, armazenamento em estado sólido, redes domésticas com vários dispositivos e home office. Essa continuidade importa por um motivo prático: boa parte do diagnóstico rápido vem de já ter visto o mesmo padrão de falha antes, em modelos e gerações diferentes.",
          "O escopo é deliberadamente estreito. Trabalhamos com computadores, notebooks, sistema, armazenamento, memória, segurança, redes e suporte a pequenas estruturas empresariais — e não com áreas fora dessa competência. Quando o caso exige laboratório especializado, como falha mecânica interna de disco, dizemos isso em vez de improvisar. Recusar um serviço fora do nosso alcance é parte de fazer bem o que está dentro dele.",
          "Atendemos Curitiba e municípios da região metropolitana. Não mantemos loja anunciada em cada bairro nem equipe fixa em outras cidades: o atendimento acontece por visita técnica combinada ou por coleta e entrega, com as condições, valores de partida e prazos publicados na página de preços e políticas."
        ]
      }
    ]
  },
  {
    "path": "/como-funciona",
    "title": "Como Funciona o Atendimento Técnico em Curitiba",
    "description": "Entenda como funciona o atendimento técnico de informática em Curitiba e região. Passo a passo completo: solicitação via WhatsApp, diagnóstico, execução e garantia.",
    "blocos": [
      {
        "titulo": "1. Triagem inicial pelo WhatsApp",
        "paragrafos": [
          "O contato começa por uma triagem curta: equipamento, sintoma percebido, há quanto tempo acontece, se houve queda, líquido ou queda de energia, e a região de atendimento. Essas respostas indicam a modalidade mais adequada — remoto, domicílio ou bancada com coleta.",
          "A triagem orienta a modalidade, mas não substitui o diagnóstico: a causa só é confirmada com o equipamento avaliado."
        ]
      },
      {
        "titulo": "2. Definição da modalidade de atendimento",
        "paragrafos": [
          "Atendimento remoto resolve o que é software: sistema lento por configuração, atualização travada, e-mail, impressora em rede e ajustes de conta. Atendimento em domicílio cobre o que depende do ambiente físico, como rede, cabeamento, montagem e limpeza. Bancada com coleta e entrega é o caminho quando há suspeita de placa, energia, tela ou armazenamento.",
          "Quando a modalidade escolhida não resolve, explicamos o motivo e indicamos a alternativa antes de qualquer execução."
        ]
      },
      {
        "titulo": "3. Diagnóstico técnico antes de qualquer execução",
        "paragrafos": [
          "O diagnóstico segue uma ordem: energia, inicialização, imagem, sistema e armazenamento. Cada etapa elimina hipóteses e reduz a chance de troca desnecessária de peça.",
          "Ao final, você recebe a explicação do que foi encontrado, o que pode ser feito e o valor correspondente ao serviço."
        ]
      },
      {
        "titulo": "4. Autorização, execução e testes",
        "paragrafos": [
          "Nenhuma execução adicional acontece sem a sua autorização. Peças, componentes e materiais são tratados à parte do serviço e dependem de disponibilidade e do modelo do equipamento.",
          "Após o reparo, o equipamento passa por testes de uso real antes da devolução: inicialização, temperatura, estabilidade, rede e acesso aos arquivos."
        ]
      },
      {
        "titulo": "5. Prazos, cancelamento e garantia",
        "paragrafos": [
          "Prazos dependem de fila, complexidade, testes e disponibilidade de peça — por isso são confirmados na avaliação, e não na triagem. Cancelamento e desistência seguem as políticas vigentes, considerando o serviço efetivamente executado.",
          "A garantia cobre o serviço executado e a peça aplicada, dentro do escopo descrito na página de preços e políticas. Falhas de causa diferente da tratada exigem nova avaliação."
        ]
      }
    ]
  },
  {
    "path": "/precos-e-politicas",
    "title": "Preços e Políticas | Técnico em Curitiba",
    "description": "Preços e políticas do atendimento de informática em Curitiba: mão de obra a partir de R$ 99,99, valor após avaliação e regras claras sobre peças, prazos e dados.",
    "blocos": [
      {
        "titulo": "Como o valor do atendimento é definido",
        "paragrafos": [
          "Não existe preço fechado por telefone para reparo, e isso não é falta de transparência: é o contrário. O que temos publicado é o ponto de partida de cada modalidade — visita técnica de inspeção a partir de R$ 99,99 por até (ou a cada) 30 minutos, pacote pré-acordado de até 2 horas por R$ 279,99 e diagnóstico com compromisso, coleta e entrega inclusas, com mínimo pré-aprovado de R$ 299,99. O valor final depende do que a avaliação confirmar.",
          "Quatro fatores pesam no resultado: a causa real confirmada no diagnóstico, o modelo e o estado do equipamento, a necessidade de bancada e ferramenta específica, e a disponibilidade de peça compatível. Um mesmo sintoma — o computador que não liga, por exemplo — pode terminar em uma verificação simples de alimentação ou em um reparo de placa, e cobrar o mesmo pelos dois seria injusto com quem tem o caso mais leve.",
          "Peças, componentes, licenças e materiais são sempre tratados à parte da mão de obra e só são adquiridos após a sua autorização. Nada além do que foi combinado é executado sem aprovação. Se o caminho técnico mudar durante o serviço, você é avisado antes, não depois."
        ]
      },
      {
        "titulo": "O que está incluído e o que não está",
        "paragrafos": [
          "Estão incluídos na modalidade contratada: a avaliação técnica do equipamento e a identificação da causa provável, a explicação em linguagem clara do que foi encontrado, a execução dos procedimentos autorizados dentro do escopo combinado, a coleta e entrega na modalidade de diagnóstico com compromisso e a garantia de 90 dias sobre a mão de obra do serviço executado.",
          "Não estão incluídos: peças, componentes, licenças de software e materiais; abertura e reparo de placas na modalidade de visita avulsa; garantia de recuperação de dados, que é sempre uma tentativa; promessa de prazo fixo de chegada ou de conclusão sem avaliação; e serviços fora do escopo de informática e redes."
        ]
      },
      {
        "titulo": "Limites técnicos declarados antes de começar",
        "paragrafos": [
          "Transparência também é dizer o que o serviço não alcança. Nem todo equipamento tem reparo viável e nem todo sintoma tem solução definitiva na primeira intervenção. Declaramos esses limites antes de iniciar, para que a decisão de seguir seja sua e informada — nunca uma surpresa depois da conta.",
          "Peça descontinuada ou sem fornecedor confiável: em modelos antigos, a peça compatível pode não existir no mercado ou vir apenas de origem incerta; nesses casos informamos e não aplicamos componente sem procedência. Reparo em nível de placa depende de bancada e do estado da placa — corrosão avançada, trilha rompida em várias camadas ou reparo anterior malfeito pode não ter recuperação estável.",
          "Dano por líquido e por surto elétrico tem efeito progressivo: mesmo com limpeza bem-sucedida, pode haver falha posterior em outro componente. Recuperação de dados é tentativa técnica, não resultado contratado. Falha intermitente que não se reproduz em teste exige observação por período maior, e informamos o que já foi descartado em vez de trocar peças por tentativa. Nosso escopo é informática, redes e Wi-Fi.",
          "Quando um desses limites aparece durante a avaliação, você recebe o cenário completo: o que foi confirmado, o que ainda é incerto, o custo de seguir e a alternativa de parar."
        ]
      },
      {
        "titulo": "Prazos, garantia e cuidado com seus dados",
        "paragrafos": [
          "O prazo depende da complexidade e da peça. Serviços de software, como reinstalação de sistema e limpeza, costumam ser mais rápidos do que reparos que dependem de componente específico. Trabalhamos com prazo estimado informado após a avaliação, e avisamos quando ele muda — em vez de prometer antes de olhar o equipamento.",
          "A garantia de 90 dias cobre a mão de obra do serviço que foi executado, no mesmo defeito tratado. Peças e componentes seguem a garantia do fornecedor ou fabricante. Ficam de fora da garantia: falha de causa diferente da tratada, dano por queda, líquido, surto elétrico ou mau uso, intervenção de terceiros após o atendimento, e desgaste natural de bateria e de armazenamento.",
          "Sobre dados: recomendamos backup antes de qualquer intervenção que envolva armazenamento, e quando possível fazemos cópia preventiva. O acesso a arquivos se limita ao necessário para o serviço autorizado. Tentativa de recuperação de conteúdo já perdido é outro serviço e não tem resultado garantido. Quando o reparo deixa de fazer sentido diante do valor do equipamento, dizemos isso abertamente."
        ]
      },
      {
        "titulo": "Pagamento e nota fiscal",
        "paragrafos": [
          "O pagamento acontece na conclusão do atendimento, depois que o serviço aprovado foi executado e testado com você presente ou em contato. Nenhum valor é cobrado sem aprovação prévia: o escopo e o valor são apresentados antes da execução, e é você quem decide se o serviço segue. Em caso de desistência após o diagnóstico, é devido apenas o valor do diagnóstico informado antes de começar.",
          "As formas de pagamento aceitas são confirmadas na triagem pelo WhatsApp e reconfirmadas no fechamento do atendimento, para evitar mal-entendido no momento da entrega. Peças e componentes são cobrados à parte do valor da mão de obra e só entram na conta depois da sua autorização expressa, com o valor apresentado antes da compra.",
          "Sobre documento fiscal: a nota fiscal de serviço é emitida mediante solicitação, e as peças adquiridas acompanham a nota do fornecedor quando aplicável. Se a nota precisa sair em nome da empresa, informe os dados do tomador ainda na triagem, antes da conclusão do serviço — assim o documento sai correto de primeira, sem retrabalho de cancelamento e reemissão.",
          "Segurança na cobrança: não solicitamos pagamento antecipado por links enviados de números desconhecidos, nem depósito em conta de terceiros. Qualquer cobrança que fuja do combinado no atendimento deve ser confirmada pelo WhatsApp oficial divulgado no site antes de ser paga."
        ]
      }

    ]
  },
  {
    "path": "/faq",
    "title": "FAQ Técnico Curitiba | Preço, Prazo e Garantia",
    "description": "Dúvidas sobre preço, prazo, garantia, formatação, vírus e atendimento técnico em Curitiba. Veja respostas rápidas e chame no WhatsApp."
  },
  {
    "path": "/contato",
    "title": "Contato Técnico Curitiba | Atendimento a partir de R$ 99,99",
    "description": "Fale com técnico de informática em Curitiba pelo WhatsApp. Atendimento hoje para PC, notebook, vírus, formatação e SSD a partir de R$ 99,99."
  },
  {
    "path": "/tecnico-informatica-curitiba",
    "title": "Técnico de Informática em Curitiba | PC e Notebook",
    "description": "Atendimento técnico em Curitiba para computador, notebook, formatação, SSD, vírus, recuperação de dados, Wi-Fi e suporte para empresas."
  },
  {
    "path": "/tecnico-informatica-sao-jose-pinhais",
    "title": "Técnico em São José dos Pinhais para Notebook e PC",
    "description": "Técnico de informática em São José dos Pinhais: formatação, conserto de notebook e PC, upgrade de SSD, redes e suporte a empresas."
  },
  {
    "path": "/tecnico-informatica-pinhais",
    "title": "Técnico em Pinhais para Notebook, PC e Redes",
    "description": "Técnico de informática em Pinhais: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial."
  },
  {
    "path": "/tecnico-informatica-colombo",
    "title": "Técnico em Colombo para Notebook, PC e Informática",
    "description": "Técnico de informática em Colombo: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial."
  },
  {
    "path": "/tecnico-informatica-araucaria",
    "title": "Técnico em Araucária para Notebook, PC e Empresas",
    "description": "Técnico de informática em Araucária: formatação, conserto de notebook e PC, upgrade de SSD, redes e suporte empresarial."
  },
  {
    "path": "/tecnico-informatica-campo-largo",
    "title": "Técnico em Campo Largo para Notebook, PC e Redes",
    "description": "Técnico de informática em Campo Largo: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial."
  },
  {
    "path": "/tecnico-informatica-piraquara",
    "title": "Técnico em Piraquara para Notebook, PC e Internet",
    "description": "Técnico de informática em Piraquara: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus e Wi-Fi."
  },
  {
    "path": "/tecnico-informatica-quatro-barras",
    "title": "Técnico em Quatro Barras para PC, Notebook e Redes",
    "description": "Técnico de informática em Quatro Barras: conserto de notebook e PC, formatação, upgrade de SSD, redes e suporte a pequenas empresas."
  },
  {
    "path": "/tecnico-informatica-campo-magro",
    "title": "Técnico em Campo Magro para Notebook, PC e Wi-Fi",
    "description": "Técnico de informática em Campo Magro: conserto de notebook e PC, formatação, upgrade de SSD, remoção de vírus e Wi-Fi em chácaras e casas."
  },
  {
    "path": "/tecnico-informatica-almirante-tamandare",
    "title": "Técnico em Almirante Tamandaré | Notebook e PC",
    "description": "Técnico de informática em Almirante Tamandaré: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus e redes."
  },
  {
    "path": "/tecnico-informatica-fazenda-rio-grande",
    "title": "Técnico em Fazenda Rio Grande | PC, Notebook e Rede",
    "description": "Técnico de informática em Fazenda Rio Grande: conserto de notebook e PC, formatação, upgrade de SSD, remoção de vírus e redes."
  },
  {
    "path": "/empresa-de-ti-curitiba",
    "title": "Empresa de TI em Curitiba | Soluções para Pequenas Empresas",
    "description": "Soluções de informática para empresas em Curitiba: diagnóstico do ambiente, computadores, redes, manutenção e organização do suporte técnico."
  },
  {
    "path": "/bairros/cic",
    "title": "Técnico de Informática no CIC (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no CIC, Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para empresas. Diagnóstico a partir de R$ 99,99.",
    "faq": [
      {
        "question": "Vocês atendem empresas e comércios no CIC?",
        "answer": "Sim. Como o CIC concentra muitas operações, damos suporte pontual ou recorrente sob consulta a estações de trabalho, rede e rotinas de backup. A avaliação começa pelo WhatsApp."
      },
      {
        "question": "O atendimento no CIC é no local ou por coleta?",
        "answer": "Depende do problema. Casos como formatação, upgrade e configuração de rede costumam ser resolvidos no local; reparos de bancada seguem por coleta e entrega, sempre com sua aprovação."
      },
      {
        "question": "Quanto custa o diagnóstico no CIC?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças — e nada é executado sem aprovação."
      },
      {
        "question": "Vale mais a pena consertar ou trocar o computador?",
        "answer": "Em muitos casos, um upgrade de SSD e memória resolve a lentidão por um custo menor que a troca. Avaliamos o equipamento e explicamos com clareza antes de indicar qualquer caminho."
      }
    ]
  },
  {
    "path": "/bairros/batel",
    "title": "Técnico de Informática no Batel (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Batel, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Diagnóstico a partir de R$ 99,99.",
    "faq": [
      {
        "question": "Fazem suporte para home office no Batel?",
        "answer": "Sim. Ajustamos desempenho, organizamos programas e melhoramos a estabilidade do Wi-Fi para reuniões online. A avaliação do que é necessário é feita após a triagem pelo WhatsApp."
      },
      {
        "question": "Atendem apartamentos e prédios no Batel?",
        "answer": "Sim, atendemos residências e pequenos escritórios. Em prédios, basta liberar o acesso na portaria no horário combinado. A modalidade depende do tipo de serviço."
      },
      {
        "question": "Meu notebook está lento — precisa trocar?",
        "answer": "Nem sempre. Muitas vezes um upgrade de SSD e memória, somado a uma limpeza, devolve a agilidade. Avaliamos antes de indicar troca e explicamos o ganho realista."
      },
      {
        "question": "Qual o valor do atendimento no Batel?",
        "answer": "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes."
      }
    ]
  },
  {
    "path": "/bairros/agua-verde",
    "title": "Técnico de Informática no Água Verde | Notebook e PC",
    "description": "Técnico de informática no Água Verde, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Diagnóstico a partir de R$ 99,99.",
    "faq": [
      {
        "question": "Vocês fazem upgrade de SSD no Água Verde?",
        "answer": "Sim, é um dos serviços mais pedidos no bairro. A troca por SSD com aumento de memória costuma trazer ganho perceptível em máquinas antigas, avaliado caso a caso."
      },
      {
        "question": "Formatam com backup dos meus arquivos?",
        "answer": "Sim. Sempre que possível, fazemos o backup dos arquivos antes de reinstalar o Windows e devolvemos a máquina com drivers, antivírus e programas essenciais já configurados."
      },
      {
        "question": "Conseguem recuperar arquivos apagados?",
        "answer": "Fazemos a tentativa de recuperação de dados. Não há garantia, pois o resultado depende do estado físico e lógico da mídia — e explicamos as chances antes de iniciar."
      },
      {
        "question": "O atendimento é a domicílio no Água Verde?",
        "answer": "Pode ser a domicílio ou por coleta e entrega, conforme o serviço. Reparos de bancada seguem para a oficina; a definição acontece após a triagem pelo WhatsApp."
      }
    ]
  },
  {
    "path": "/bairros/centro",
    "title": "Técnico de Informática no Centro de Curitiba | Notebook e PC",
    "description": "Técnico de informática no Centro de Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para escritórios.",
    "faq": [
      {
        "question": "Atendem escritórios e lojas no Centro de Curitiba?",
        "answer": "Sim. Boa parte da demanda no Centro é comercial: PCs de balcão, escritórios e consultórios. Fazemos suporte pontual ou recorrente sob consulta, começando pela triagem no WhatsApp."
      },
      {
        "question": "Vocês têm loja física no Centro?",
        "answer": "Não trabalhamos com loja de balcão. O atendimento é combinado por WhatsApp e realizado a domicílio, remotamente ou por coleta e entrega, conforme o tipo de serviço."
      },
      {
        "question": "Dá para reduzir o tempo de parada da empresa?",
        "answer": "Esse é o foco no Centro: triagem rápida e diagnóstico objetivo. Casos simples costumam ser resolvidos no local; quando é preciso bancada, informamos o prazo antes de retirar o equipamento."
      },
      {
        "question": "Qual o valor da avaliação no Centro?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, e é sempre aprovado por você antes."
      }
    ]
  },
  {
    "path": "/bairros/portao",
    "title": "Técnico de Informática no Portão (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Portão, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD.",
    "faq": [
      {
        "question": "Atendem o comércio do Portão?",
        "answer": "Sim. Damos suporte ao PC do balcão, à impressora e à rede de pequenos comércios, com foco em reduzir o tempo de parada. A avaliação começa pela triagem no WhatsApp."
      },
      {
        "question": "O Wi-Fi não cobre a casa toda — vocês resolvem?",
        "answer": "Avaliamos o posicionamento do roteador e a necessidade de repetidor ou sistema mesh para melhorar a cobertura. A indicação depende do tamanho do imóvel e da estrutura."
      },
      {
        "question": "Recebi um aviso pedindo pagamento para liberar o PC. É golpe?",
        "answer": "Quase sempre é golpe. Não pague nada antes de uma avaliação. Fale conosco pelo WhatsApp que verificamos o caso com segurança antes de qualquer serviço."
      },
      {
        "question": "Qual o valor do atendimento no Portão?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças, sempre aprovado por você antes."
      }
    ]
  },
  {
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
  },
  {
    "path": "/bairros/santa-felicidade",
    "title": "Técnico de Informática em Santa Felicidade | Curitiba",
    "description": "Técnico de informática em Santa Felicidade, Curitiba: conserto de PC e notebook, formatação, Wi-Fi em casa grande e suporte a comércio. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "O Wi-Fi não chega aos fundos da casa. Como resolvem?",
        "answer": "Em casas grandes o ponto de partida é medir o sinal ambiente por ambiente. A partir disso indicamos reposicionamento, troca de canal, cabeamento até um segundo ponto ou sistema mesh — sem prometer solução antes de medir."
      },
      {
        "question": "Atendem restaurantes e lojas de Santa Felicidade?",
        "answer": "Sim. Damos suporte pontual ou combinado ao computador do caixa, à impressora de comanda e à rede do estabelecimento, com foco em reduzir o tempo de parada."
      },
      {
        "question": "Posso levar o equipamento até vocês?",
        "answer": "Não trabalhamos com balcão ao público. Quando o caso exige bancada, fazemos coleta e entrega no seu endereço, com sua aprovação antes de qualquer serviço."
      },
      {
        "question": "Qual o valor do atendimento em Santa Felicidade?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças, sempre informado e aprovado antes."
      }
    ]
  },
  {
    "path": "/bairros/cabral",
    "title": "Técnico de Informática no Cabral (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Cabral, Curitiba: conserto de notebook, formatação, upgrade de SSD e suporte a consultórios e escritórios. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Atendem consultórios e escritórios no Cabral?",
        "answer": "Sim. Trabalhamos com janela de horário combinada para não interromper o atendimento, e a formatação de máquina de trabalho só acontece após backup e conferência de acessos e licenças."
      },
      {
        "question": "Vocês fazem backup antes de formatar?",
        "answer": "Sempre que o disco permite leitura, o backup dos dados é a primeira etapa e é conferido com você antes de qualquer reinstalação. Se o disco estiver com falha, isso é informado antes de prosseguir."
      },
      {
        "question": "Preciso levar o equipamento em alguma loja?",
        "answer": "Não. Não temos balcão ao público: o serviço é feito no seu endereço ou o equipamento é coletado e devolvido quando o caso exige bancada."
      },
      {
        "question": "Qual o valor do atendimento no Cabral?",
        "answer": "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes."
      }
    ]
  },
  {
    "path": "/bairros/cristo-rei",
    "title": "Técnico de Informática no Cristo Rei (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Cristo Rei, Curitiba: conserto de notebook, formatação, upgrade de SSD e Wi-Fi para estudantes e famílias. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Meu notebook travou e tenho trabalho para entregar. Dá para priorizar?",
        "answer": "Informe o prazo já na triagem pelo WhatsApp. Quando o caso permite, priorizamos o acesso aos arquivos primeiro — mesmo que o reparo completo leve mais tempo depois."
      },
      {
        "question": "Vale a pena consertar um computador antigo no Cristo Rei?",
        "answer": "Depende do equipamento. Em muitos casos SSD e memória devolvem a agilidade por um custo bem menor que a troca; em outros, o reparo não se paga. Explicamos os dois cenários antes de você decidir."
      },
      {
        "question": "Atendem repúblicas e apartamentos de estudante?",
        "answer": "Sim. Serviços de software, rede e upgrade costumam ser feitos no próprio endereço. Casos de bancada seguem por coleta e entrega, com aprovação prévia."
      },
      {
        "question": "Qual o valor do atendimento no Cristo Rei?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado antes da execução."
      }
    ]
  },
  {
    "path": "/bairros/boa-vista",
    "title": "Técnico de Informática no Boa Vista (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Boa Vista, Curitiba: conserto de computador e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Meu computador ficou muito lento. Precisa trocar?",
        "answer": "Na maioria dos casos do bairro, não. Computador com disco mecânico costuma voltar a responder bem com SSD, memória e limpeza do sistema. Só indicamos troca quando o reparo não se paga — e explicamos o porquê."
      },
      {
        "question": "Vocês fazem backup das fotos antes de formatar?",
        "answer": "Sim, sempre que o disco permite leitura. O backup é a primeira etapa e é conferido com você antes de qualquer reinstalação."
      },
      {
        "question": "Preciso levar o equipamento até vocês?",
        "answer": "Não. Não temos balcão ao público: o serviço é feito no seu endereço ou fazemos coleta e entrega quando o caso exige bancada."
      },
      {
        "question": "Qual o valor do atendimento no Boa Vista?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes da execução."
      }
    ]
  },
  {
    "path": "/bairros/cajuru",
    "title": "Técnico de Informática no Cajuru (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Cajuru, Curitiba: conserto de notebook e PC, formatação com backup, remoção de vírus e Wi-Fi. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Atendem comércio pequeno no Cajuru?",
        "answer": "Sim. Damos suporte pontual ao PC do caixa, à impressora de cupom e à rede do estabelecimento, com foco em reduzir o tempo em que o atendimento fica parado."
      },
      {
        "question": "O Wi-Fi não cobre a casa toda. O que fazer?",
        "answer": "Em casas com muitos cômodos e paredes espessas, medimos o sinal ambiente por ambiente antes de indicar solução: pode ser reposicionamento, troca de canal, cabo até um segundo ponto ou mesh."
      },
      {
        "question": "Posso levar o equipamento até vocês?",
        "answer": "Não trabalhamos com balcão ao público. Atendemos no seu endereço ou fazemos coleta e entrega quando o serviço exige bancada."
      },
      {
        "question": "Quanto custa o atendimento no Cajuru?",
        "answer": "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre informado e aprovado antes."
      }
    ]
  },
  {
    "path": "/bairros/xaxim",
    "title": "Técnico de Informática no Xaxim (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Xaxim, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi em casa. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "O Wi-Fi cai quando todos usam ao mesmo tempo. Tem solução?",
        "answer": "Geralmente sim. Medimos o sinal nos cômodos usados, verificamos interferência de canal e o limite do aparelho da operadora, e só então indicamos reposicionamento, ponto extra por cabo ou mesh."
      },
      {
        "question": "Vale a pena consertar um notebook antigo do Xaxim?",
        "answer": "Depende do estado da placa, da tela e do custo da peça. Fazemos o diagnóstico e dizemos com clareza quando o reparo compensa e quando o dinheiro é melhor aplicado em outro equipamento."
      },
      {
        "question": "Vocês atendem à noite ou no fim de semana?",
        "answer": "Trabalhamos por agendamento e ajustamos a janela conforme a agenda disponível. Informe na triagem o melhor horário e confirmamos o que é possível."
      },
      {
        "question": "Quanto custa o atendimento no Xaxim?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes."
      }
    ]
  },
  {
    "path": "/bairros/novo-mundo",
    "title": "Técnico de Informática no Novo Mundo (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Novo Mundo, Curitiba: manutenção de computador, conserto de notebook, upgrade de SSD e rede para comércio. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Atendem lojas e escritórios no Novo Mundo?",
        "answer": "Sim, com suporte pontual ou acompanhamento recorrente: computador do balcão, impressora, rede e rotina de backup. Combinamos a janela de atendimento para reduzir o impacto no expediente."
      },
      {
        "question": "O computador demora muito para abrir o sistema. É vírus?",
        "answer": "Nem sempre. Disco mecânico saturado, memória insuficiente e programas em segundo plano explicam boa parte dos casos. O diagnóstico distingue causa de software e de hardware antes de qualquer troca."
      },
      {
        "question": "Perdi arquivos importantes. Ainda dá para recuperar?",
        "answer": "Em muitos casos sim, desde que o equipamento pare de ser usado imediatamente. Avaliamos o disco e informamos a chance real de recuperação antes de iniciar."
      },
      {
        "question": "Como é cobrado o serviço no Novo Mundo?",
        "answer": "A partir de R$ 99,99 quando aplicável, com o valor final definido após o diagnóstico e aprovado por você antes da execução."
      }
    ]
  },
  {
    "path": "/bairros/uberaba",
    "title": "Técnico de Informática no Uberaba (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Uberaba, Curitiba: conserto de notebook, formatação, remoção de vírus e Wi-Fi para home office. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Trabalho em casa e não posso ficar sem o notebook. Como fica?",
        "answer": "Diga isso na triagem. Priorizamos o que pode ser resolvido remotamente ou no seu endereço e, quando a coleta é inevitável, alinhamos prazo antes de retirar o equipamento."
      },
      {
        "question": "A internet do apartamento oscila nas chamadas. É o provedor?",
        "answer": "Pode ser, mas em prédios o mais comum é disputa de canal com dezenas de redes vizinhas. Medimos e ajustamos canal, banda e posição do roteador antes de sugerir trocar de plano ou aparelho."
      },
      {
        "question": "Vocês instalam programas e configuram e-mail corporativo?",
        "answer": "Sim, incluindo pacote de escritório, VPN, impressoras e contas de e-mail, com atenção às licenças que você já possui."
      },
      {
        "question": "Qual o valor do serviço no Uberaba?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final é definido após o diagnóstico e depende do equipamento, da complexidade e de peças, sempre aprovado antes."
      }
    ]
  },
  {
    "path": "/bairros/reboucas",
    "title": "Técnico de Informática no Rebouças (Curitiba) | Empresas e PC",
    "description": "Técnico de informática no Rebouças, Curitiba: suporte a escritórios, manutenção de computador, formatação e rede. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "Vocês dão suporte a escritórios pequenos no Rebouças?",
        "answer": "Sim. Atendemos equipes enxutas com chamados pontuais ou acompanhamento periódico, cobrindo estações, rede, impressoras e rotina de backup."
      },
      {
        "question": "Dá para melhorar uma máquina de edição sem trocar tudo?",
        "answer": "Frequentemente sim. Avaliamos gargalo real — disco, memória, refrigeração ou processador — e indicamos o upgrade que traz ganho perceptível, evitando gasto desnecessário."
      },
      {
        "question": "Como funciona o backup para empresa?",
        "answer": "Definimos o que precisa ser copiado, com que frequência e para onde, e testamos a restauração. Backup que nunca foi restaurado não é backup confiável."
      },
      {
        "question": "Quanto custa o atendimento no Rebouças?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do número de equipamentos, da complexidade e de peças, sempre aprovado antes da execução."
      }
    ]
  },
  {
    "path": "/bairros/hauer",
    "title": "Técnico de Informática no Hauer (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Hauer, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e rede Wi-Fi. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Vocês atendem no Hauer no mesmo dia?",
        "answer": "Depende da agenda e do tipo de problema. Na triagem pelo WhatsApp informamos o primeiro horário realmente disponível, sem prometer prazo que não conseguimos cumprir."
      },
      {
        "question": "Meu computador esquenta e trava. Precisa trocar?",
        "answer": "Na maioria dos casos, não. Superaquecimento costuma vir de dissipador entupido e pasta térmica ressecada. Fazemos a limpeza, medimos temperatura sob carga e só indicamos peça se o problema persistir."
      },
      {
        "question": "Atendem comércio na Marechal Floriano?",
        "answer": "Sim. Trabalhamos com estações de frente de caixa, impressora e rede da loja, combinando horário fora do pico para reduzir o impacto no atendimento ao cliente."
      },
      {
        "question": "O Wi-Fi não chega nos quartos dos fundos. Tem solução?",
        "answer": "Sim. Medimos o sinal ponto a ponto, avaliamos reposicionamento do roteador e, se realmente for necessário, indicamos repetidor ou ponto de acesso adicional com cabeamento."
      },
      {
        "question": "Quanto custa o atendimento no Hauer?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e de eventuais peças, sempre apresentado e aprovado antes da execução."
      }
    ]
  },
  {
    "path": "/bairros/pinheirinho",
    "title": "Técnico de Informática no Pinheirinho (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Pinheirinho, Curitiba: manutenção de computador, conserto de notebook, formatação e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "Formatar apaga meus arquivos e fotos?",
        "answer": "Não, quando o backup é feito antes. Combinamos o que precisa ser salvo, copiamos os dados, reinstalamos o sistema e devolvemos os arquivos organizados na máquina."
      },
      {
        "question": "Meu notebook está cheio de propaganda abrindo sozinha. É vírus?",
        "answer": "Normalmente é adware instalado junto com algum programa baixado fora da loja oficial. Fazemos a remoção, limpamos os navegadores e mostramos de onde veio para evitar reincidência."
      },
      {
        "question": "Vale a pena colocar SSD num computador antigo?",
        "answer": "Na maioria das vezes sim. Em máquinas com disco mecânico, a troca por SSD costuma ser o upgrade com maior ganho percebido por real investido. Avaliamos antes se a máquina comporta."
      },
      {
        "question": "Atendem pequenos negócios no Pinheirinho?",
        "answer": "Sim. Atendemos comércios de rua com computador de vendas, impressora e rede, com horário combinado para não travar o atendimento."
      },
      {
        "question": "Qual o valor do serviço no Pinheirinho?",
        "answer": "A partir de R$ 99,99 quando aplicável. O total depende do serviço executado e de peças, sempre aprovado por você antes de começarmos."
      }
    ]
  },
  {
    "path": "/bairros/bacacheri",
    "title": "Técnico de Informática no Bacacheri (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Bacacheri, Curitiba: conserto de notebook, manutenção de computador, formatação e rede Wi-Fi. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Minha casa é grande e o Wi-Fi não chega nos fundos. O que fazem?",
        "answer": "Medimos a intensidade do sinal nos cômodos críticos, avaliamos reposicionamento do roteador e, quando necessário, indicamos ponto de acesso adicional ou repetidor com posicionamento correto — não apenas um aparelho a mais na tomada."
      },
      {
        "question": "Trabalho em casa e não posso ficar sem o computador. Como funciona?",
        "answer": "Priorizamos deixar a máquina operacional no atendimento e separamos para bancada apenas o que exige desmontagem. Combinamos previamente o tempo estimado de indisponibilidade."
      },
      {
        "question": "Meu PC de mesa é antigo. Compensa consertar?",
        "answer": "Avaliamos o hardware atual e o uso pretendido. Se a base ainda for adequada, SSD, memória e limpeza térmica costumam resolver. Se não for, dizemos com clareza que a substituição é a melhor escolha."
      },
      {
        "question": "Vocês fazem coleta no Bacacheri?",
        "answer": "Sim, para os casos que exigem bancada. A coleta é combinada na triagem e o equipamento é devolvido após o reparo aprovado."
      },
      {
        "question": "Quanto custa o atendimento no Bacacheri?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e de peças, informado e aprovado antes da execução."
      }
    ]
  },
  {
    "path": "/bairros/capao-raso",
    "title": "Técnico de Informática no Capão Raso (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Capão Raso, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e upgrade de SSD. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "O Wi-Fi do meu apartamento no Capão Raso é fraco no quarto. Dá para resolver?",
        "answer": "Sim. Verificamos canal, posicionamento e interferência de redes vizinhas — em prédio, é comum o problema ser congestionamento de canal, e não falta de aparelho."
      },
      {
        "question": "Meu computador demora minutos para ligar. O que costuma ser?",
        "answer": "Na maior parte dos casos é disco mecânico somado a programas iniciando junto com o sistema. Migração para SSD e limpeza de inicialização mudam completamente a experiência de uso."
      },
      {
        "question": "Atendem loja com sistema de vendas?",
        "answer": "Sim. Combinamos horário de menor movimento, avaliamos o computador de caixa, a impressora e a rede, e orientamos sobre backup dos registros."
      },
      {
        "question": "Vocês tentam recuperar arquivos de HD com defeito?",
        "answer": "Fazemos a tentativa em bancada e informamos as chances antes. Recuperação de dados nunca tem garantia de sucesso — o que garantimos é transparência sobre o que é possível."
      },
      {
        "question": "Quanto custa o atendimento no Capão Raso?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e de peças, sempre apresentado e aprovado antes da execução."
      }
    ]
  },
  {
    "path": "/bairros/sitio-cercado",
    "title": "Técnico de Informática no Sítio Cercado (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Sítio Cercado, Curitiba: formatação com backup, remoção de vírus, troca de SSD e conserto de notebook. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Vale a pena consertar um notebook antigo do Sítio Cercado ou comprar outro?",
        "answer": "Depende do diagnóstico. Se a placa está saudável e o gargalo é disco mecânico, memória curta ou sistema comprometido, o reparo custa muito menos que um aparelho novo. Quando a placa exige reparo caro, dizemos isso com clareza e você decide."
      },
      {
        "question": "Consigo atendimento fora do horário comercial?",
        "answer": "Combinamos horário na triagem, incluindo fim de tarde. Não prometemos horário antes de confirmar a agenda do dia."
      },
      {
        "question": "Meus arquivos e fotos se perdem na formatação?",
        "answer": "Não, quando o disco está legível. Fazemos o backup antes, você confere o que foi salvo e só então reinstalamos o sistema."
      },
      {
        "question": "O Wi-Fi não sobe para o segundo andar. Preciso de repetidor?",
        "answer": "Nem sempre. Medimos o sinal em cada cômodo e testamos reposicionamento e troca de canal antes de indicar qualquer equipamento extra."
      },
      {
        "question": "Atendem pequenos comércios do bairro?",
        "answer": "Sim. Trabalhamos com computador de caixa, impressora fiscal e rede da loja, com horário combinado para não parar o movimento."
      }
    ]
  },
  {
    "path": "/bairros/fazendinha",
    "title": "Técnico de Informática na Fazendinha (Curitiba) | Notebook e PC",
    "description": "Técnico de informática na Fazendinha, Curitiba: conserto de notebook, formatação, limpeza interna e configuração de Wi-Fi. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "O computador da minha loja na Fazendinha trava no horário de pico. Dá para resolver no local?",
        "answer": "Na maioria das vezes sim: limpeza, revisão térmica, troca de disco e ajuste do sistema são feitos no próprio balcão. Só levamos para bancada quando há suspeita de falha elétrica na placa."
      },
      {
        "question": "Vocês configuram impressora compartilhada?",
        "answer": "Sim. Instalamos e compartilhamos impressora na rede local, incluindo o caso comum de cada computador enxergar a impressora com nome diferente."
      },
      {
        "question": "Tenho edícula nos fundos sem sinal. Repetidor resolve?",
        "answer": "Depende da estrutura. Onde há parede dupla, repetidor entrega sinal fraco. Costuma ser mais estável um cabo curto até um ponto de acesso no fundo — avaliamos antes de indicar."
      },
      {
        "question": "Qual o valor do atendimento na Fazendinha?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e das peças, apresentado antes da execução."
      },
      {
        "question": "Preciso levar o equipamento em algum lugar?",
        "answer": "Não. Não temos balcão de atendimento ao público: quando o caso exige bancada, combinamos coleta e devolução."
      }
    ]
  },
  {
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
  },
  {
    "path": "/bairros/merces",
    "title": "Técnico de Informática nas Mercês (Curitiba) | Notebook e PC",
    "description": "Técnico de informática nas Mercês, Curitiba: conserto de notebook, formatação com backup, recuperação de arquivos e Wi-Fi. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Consigo recuperar arquivos de um disco que parou de abrir?",
        "answer": "Em muitos casos sim, quando a falha é lógica ou o disco ainda é reconhecido. Avaliamos antes e informamos com honestidade a chance real de recuperação, sem cobrar promessa de resultado."
      },
      {
        "question": "Atendem consultórios sem parar o atendimento?",
        "answer": "Sim. Combinamos janela de horário fora da agenda de pacientes e priorizamos o que pode ser feito sem derrubar o sistema em uso."
      },
      {
        "question": "Tenho três repetidores e o Wi-Fi continua ruim. Por quê?",
        "answer": "Repetidores em série dividem a banda e aumentam a latência. Medimos o sinal e normalmente substituímos o arranjo por um ponto de acesso bem posicionado, com cabo quando possível."
      },
      {
        "question": "Vocês configuram backup automático?",
        "answer": "Sim, em nuvem e/ou disco externo, com rotina programada e teste de restauração para comprovar que os arquivos voltam."
      },
      {
        "question": "Quanto custa o atendimento nas Mercês?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final sai após o diagnóstico e só é executado com sua aprovação."
      }
    ]
  },
  {
    "path": "/bairros/juveve",
    "title": "Técnico de Informática no Juvevê (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Juvevê, Curitiba: suporte a home office, formatação, upgrade de SSD, Wi-Fi e conserto de notebook. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Meu notebook ficou lento depois de anos de uso. SSD resolve?",
        "answer": "Ajuda muito, mas raramente sozinho. Avaliamos disco, memória e refrigeração juntos: trocar só o disco em uma máquina que superaquece devolve pouco ganho percebido."
      },
      {
        "question": "Quanto tempo leva um upgrade de SSD?",
        "answer": "Quando é feito no local e a máquina permite acesso simples, costuma ser resolvido na mesma visita, incluindo migração dos seus dados. Casos com carcaça complexa vão para bancada."
      },
      {
        "question": "Vocês atendem em apartamento com portaria?",
        "answer": "Sim. Só pedimos que a autorização de acesso seja combinada antes, no horário definido na triagem."
      },
      {
        "question": "Dá para melhorar o Wi-Fi no escritório do apartamento?",
        "answer": "Sim. Medimos a cobertura no cômodo de trabalho, ajustamos faixa e canal e, se ainda faltar sinal, indicamos a solução mais estável para a planta do imóvel."
      },
      {
        "question": "Qual o valor do atendimento no Juvevê?",
        "answer": "A partir de R$ 99,99 quando aplicável, com valor final informado após o diagnóstico e aprovado antes da execução."
      }
    ]
  },
  {
    "path": "/bairros/seminario",
    "title": "Técnico de Informática no Seminário (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Seminário, Curitiba: formatação, remoção de vírus, upgrade de SSD, Wi-Fi e conserto de notebook. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Preciso do notebook para uma entrega esta semana. Dá para priorizar?",
        "answer": "Informe o prazo na triagem. Priorizamos o que é possível dentro da agenda real do dia e dizemos com antecedência se o prazo não é viável."
      },
      {
        "question": "Mais memória ou SSD: o que resolve meu caso?",
        "answer": "Medimos o uso real da máquina antes de indicar. Planilhas grandes e muitas abas pedem memória; lentidão para abrir sistema e programas pede SSD. Muitas vezes o ganho vem da combinação."
      },
      {
        "question": "Meus trabalhos ficam salvos na formatação?",
        "answer": "Sim, quando o disco está legível. Fazemos backup, você confere os arquivos e só depois reinstalamos o sistema."
      },
      {
        "question": "O Wi-Fi cai no quarto do fundo durante aula online. Como resolvem?",
        "answer": "Medimos o sinal no cômodo em uso, ajustamos faixa e canal do roteador e, se necessário, indicamos ponto de acesso adicional — mostrando a medição antes e depois."
      },
      {
        "question": "Quanto custa o atendimento no Seminário?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e das peças, sempre aprovado por você antes."
      }
    ]
  },
  {
    "path": "/bairros/boqueirao",
    "title": "Técnico de Informática no Boqueirão (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Boqueirão, Curitiba: conserto de PC e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Meu PC emite nota e não pode parar. Como funciona?",
        "answer": "Informe isso na triagem. Fazemos backup e conferimos acessos e licenças antes de mexer no sistema, e combinamos a janela de atendimento para reduzir o tempo de parada."
      },
      {
        "question": "Vale trocar o HD por SSD em máquina antiga?",
        "answer": "Na maior parte dos casos sim: é a mudança que mais devolve agilidade por um custo baixo. Avaliamos o equipamento antes e dizemos com clareza quando o investimento não compensa."
      },
      {
        "question": "Preciso levar o equipamento a algum endereço?",
        "answer": "Não. Não temos balcão ao público: atendemos no seu endereço ou fazemos coleta e entrega quando o caso exige bancada."
      },
      {
        "question": "Qual o valor do atendimento no Boqueirão?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças, sempre aprovado antes."
      }
    ]
  },
  {
    "path": "/atendimento-domicilio",
    "title": "Atendimento de Informática em Domicílio em Curitiba",
    "description": "Atendimento técnico de informática em domicílio em Curitiba: o que resolve no local, o que exige coleta ou bancada, preparação da visita, peças e fatores de valor.",
    "faq": [
      {
        "pergunta": "Quais serviços podem ser feitos no local?",
        "resposta": "Instalação e configuração de programas, ajustes de rede e Wi-Fi, remoção de vírus, backup, configuração de impressora e a maioria dos problemas de software costumam ser resolvidos na sua casa ou escritório. A confirmação depende da triagem prévia."
      },
      {
        "pergunta": "Quando o equipamento precisa ser coletado?",
        "resposta": "Casos que exigem bancada — como equipamento que não liga, reparo de placa, troca de tela ou recuperação de dados — normalmente não são resolvidos no local e seguem para coleta e entrega, com diagnóstico em laboratório."
      },
      {
        "pergunta": "O atendimento em domicílio garante a resolução na hora?",
        "resposta": "Nem sempre. O atendimento no local resolve boa parte dos casos de software, mas alguns problemas só são confirmados durante a avaliação e podem exigir peças, coleta ou tempo adicional."
      },
      {
        "pergunta": "Como funciona a triagem antes da visita?",
        "resposta": "Antes de agendar, conversamos pelo WhatsApp sobre o sintoma. Enviar informações e fotos do equipamento ajuda a avaliar se o caso é adequado para atendimento no local ou se será melhor por coleta."
      },
      {
        "pergunta": "As peças estão incluídas na visita?",
        "resposta": "Não automaticamente. A visita cobre a mão de obra e a avaliação; peças e materiais, quando necessários, são informados à parte e só trocados após a sua aprovação."
      },
      {
        "pergunta": "Preciso desmontar ou preparar alguma coisa antes da visita?",
        "resposta": "Não. Basta deixar o equipamento acessível e ligado à energia, com a senha de acesso à mão. Se o problema for de rede ou Wi-Fi, ter o acesso ao roteador (ou o contato da operadora) agiliza bastante o atendimento no local."
      },
      {
        "pergunta": "Vocês atendem em apartamento, condomínio e escritório?",
        "resposta": "Sim. Em condomínios e prédios comerciais com controle de acesso, o agendamento é combinado com antecedência para você liberar a entrada na portaria. Informe pelo WhatsApp se houver regra específica do prédio."
      },
      {
        "pergunta": "O que acontece se o problema não for resolvido no local?",
        "resposta": "A avaliação feita na visita é aproveitada: você recebe o diagnóstico do que foi encontrado e a orientação do próximo passo — coleta para bancada, valor do atendimento de peça ou indicação de substituição quando o reparo não compensa. Nada segue sem a sua aprovação."
      },
      {
        "pergunta": "Qual a área de atendimento?",
        "resposta": "Atendemos Curitiba e a Região Metropolitana. A localização pode influenciar o agendamento e o deslocamento, combinados antes da visita."
      },
      {
        "pergunta": "É necessário levar o equipamento até vocês?",
        "resposta": "Na modalidade em domicílio, não: o atendimento acontece no seu endereço. O equipamento só sai do local quando a avaliação indica bancada, e nesse caso a coleta é combinada com você antes."
      },
      {
        "pergunta": "Posso solicitar atendimento para vários computadores?",
        "resposta": "Sim. Informe na triagem a quantidade de equipamentos e o sintoma de cada um. Isso influencia o tempo previsto da visita e o escopo do atendimento, que é combinado antes do agendamento."
      },
      {
        "pergunta": "É necessário ter alguém no local durante o atendimento?",
        "resposta": "Sim. É preciso uma pessoa responsável presente para liberar o acesso, autorizar os procedimentos e conferir o resultado ao final. Em empresas, quem autoriza alterações deve estar disponível ao menos por contato."
      },
      {
        "pergunta": "O técnico precisa acessar meus arquivos?",
        "resposta": "Somente quando o serviço exige, como em backup, migração ou formatação. O acesso é limitado ao necessário e sempre com a sua autorização. As práticas completas estão descritas na página de segurança dos dados."
      },
      {
        "pergunta": "Como funciona o cancelamento da visita?",
        "resposta": "Avise pelo WhatsApp com a maior antecedência possível para reagendar sem transtorno. Cancelamento após o técnico já estar em deslocamento pode implicar cobrança do deslocamento, conforme as condições publicadas em preços e políticas."
      },
      {
        "pergunta": "O valor pode mudar após a avaliação no local?",
        "resposta": "O valor da visita e da avaliação é informado antes. Se a avaliação revelar um serviço maior, peça necessária ou necessidade de bancada, o novo escopo é apresentado e só é executado após a sua aprovação."
      }
    ]
  },
  {
    "path": "/atendimento-remoto",
    "title": "Suporte Remoto de Informática em Curitiba | Online",
    "h1": "Suporte remoto de informática para residências e empresas",
    "description": "Suporte remoto de informática em Curitiba para configurações, sistema, programas, e-mail, impressora já conectada, orientação e home office — com autorização.",
    "blocos": [
      {
        "titulo": "O que é atendimento remoto",
        "paragrafos": [
          "Atendimento remoto é o suporte técnico executado à distância, com um programa de acesso que permite ao técnico operar o seu computador enquanto você acompanha tudo na tela. É a modalidade indicada quando o equipamento liga, o sistema carrega e existe conexão de internet estável — ou seja, quando o problema está no software, na configuração ou no uso, e não em uma peça.",
          "A vantagem é objetiva: sem deslocamento, o atendimento pode ser combinado para o horário que funciona para você e costuma resolver em uma única sessão o que exigiria uma visita inteira. Para quem trabalha em casa, isso significa voltar a produzir sem perder o dia esperando alguém chegar.",
          "A limitação também é objetiva e é dita antes: nenhum acesso remoto conserta hardware. Se durante a triagem ficar claro que a causa é física, indicamos atendimento em domicílio ou coleta e entrega em vez de iniciar uma sessão que não resolveria o caso."
        ]
      },
      {
        "titulo": "Como a sessão começa",
        "paragrafos": [
          "A triagem pelo WhatsApp vem primeiro: você descreve o problema e conferimos se ele é compatível com acesso remoto. Casos que exigem intervenção física são redirecionados para visita ou coleta antes de qualquer cobrança.",
          "Indicamos o programa de acesso e a origem oficial do download — nunca instale software de acesso enviado por remetente desconhecido ou por anúncio. A sessão só inicia quando você libera o acesso no próprio computador, e você acompanha a execução podendo interrompê-la a qualquer momento.",
          "Ao final, o acesso é encerrado. Se o programa não for mais necessário, orientamos a remoção do computador. Não mantemos acesso permanente nem monitoramento contínuo."
        ]
      },
      {
        "titulo": "Segurança de senhas e arquivos",
        "paragrafos": [
          "O acesso remoto acontece somente com a sua autorização e sob o seu acompanhamento. Senhas bancárias, códigos de autenticação e credenciais sensíveis não devem ser enviados pelo WhatsApp, e nenhuma solicitação financeira é feita durante a sessão.",
          "Dados pessoais são acessados apenas quando o próprio serviço exige — por isso não afirmamos que nenhum arquivo será aberto. As práticas completas de tratamento de arquivos, credenciais e cópias temporárias estão descritas na página de segurança dos dados."
        ]
      },
      {
        "titulo": "Residências, empresas e home office",
        "paragrafos": [
          "No uso residencial, o remoto resolve sistema travando, programas para instalar, e-mail desconfigurado e dúvidas de uso, sem ninguém precisar sair de casa. Em empresas, atende usuários com problema pontual de sistema, e-mail ou programa, enquanto demandas de estrutura e padronização seguem no suporte técnico empresarial.",
          "Para quem trabalha em casa, o foco é câmera, microfone, reuniões, e-mail e arquivos de trabalho — contexto tratado em profundidade na página de suporte para home office."
        ]
      },
      {
        "titulo": "Fatores que influenciam o valor do atendimento",
        "paragrafos": [
          "Pesam na conta a complexidade do problema, o tempo de sessão, a quantidade de equipamentos, a qualidade da conexão e a eventual necessidade de retorno. Um ajuste pontual é diferente de reconfigurar sistema, contas e programas de trabalho.",
          "Quando o remoto revela causa física, o caso migra para visita ou coleta, com escopo próprio. As condições comerciais vigentes estão publicadas em preços e políticas, e o valor é apresentado antes da sessão começar."
        ]
      }
    ],
    "faq": [
      {
        "pergunta": "O que pode ser resolvido remotamente?",
        "resposta": "Configurações do sistema, erros do Windows, atualizações, drivers, instalação de programas legítimos, e-mail, impressora já conectada, acesso a arquivos e pastas, ajustes de navegador, orientação ao usuário e o diagnóstico inicial de lentidão ligada a software."
      },
      {
        "pergunta": "Meu computador precisa estar funcionando?",
        "resposta": "Sim. O atendimento remoto depende de o equipamento ligar, o sistema carregar e existir conexão de internet estável. Sem esses três itens não há como estabelecer a sessão, e o caso passa para atendimento presencial ou coleta."
      },
      {
        "pergunta": "O técnico consegue ver meus arquivos?",
        "resposta": "Durante a sessão, a tela do seu computador fica visível para quem atende, e alguns serviços exigem abrir pastas ou configurações. O acesso é limitado ao necessário para executar o que foi combinado, e você acompanha cada passo."
      },
      {
        "pergunta": "Preciso informar minha senha?",
        "resposta": "Apenas a senha do próprio computador, quando o serviço não puder ser executado sem ela — e no momento do atendimento. Senhas bancárias, códigos de autenticação em duas etapas e credenciais sensíveis não devem ser enviados por mensagem."
      },
      {
        "pergunta": "O programa de acesso fica instalado depois?",
        "resposta": "Não precisa ficar. Encerramos o acesso ao final do atendimento e, se você preferir, orientamos a remoção do programa. Não mantemos acesso permanente nem monitoramento contínuo do seu equipamento."
      },
      {
        "pergunta": "Problemas de hardware podem ser resolvidos remotamente?",
        "resposta": "Não. Equipamento que não liga, tela sem imagem, aquecimento, dano por líquido, bateria, fonte, placa-mãe ou disco fisicamente danificado exigem avaliação presencial ou coleta. O remoto pode, no máximo, ajudar a levantar indícios antes da visita."
      },
      {
        "pergunta": "O atendimento remoto possui garantia?",
        "resposta": "O serviço executado tem garantia sobre aquilo que foi feito, nas condições descritas na página de preços e políticas. A garantia não cobre novo problema de causa diferente nem alterações feitas depois por outra pessoa."
      },
      {
        "pergunta": "O valor é informado antes do início?",
        "resposta": "Sim. Depois da triagem, confirmamos se o caso é compatível com acesso remoto e apresentamos o valor do atendimento. A sessão só começa após a sua aprovação."
      }
    ]
  },
  {
    "path": "/coleta-e-entrega",
    "title": "Coleta e Entrega de Computador e Notebook em Curitiba",
    "description": "Coleta e entrega agendada para computadores e notebooks que precisam de diagnóstico, manutenção ou serviço técnico em bancada.",
    "blocos": [
      {
        "titulo": "Como funciona a coleta e entrega",
        "paragrafos": [
          "A coleta e entrega é a modalidade indicada quando o serviço não pode ser concluído no local: reparo de placa, troca de tela, diagnóstico demorado, recuperação de dados e qualquer caso que exija bancada, ferramenta específica ou tempo estendido de teste. Em vez de você transportar o equipamento, buscamos na sua casa ou empresa em Curitiba e região, executamos o serviço em laboratório e devolvemos no endereço combinado.",
          "O fluxo tem quatro etapas. Primeiro, a triagem pelo WhatsApp: você descreve o equipamento e o sintoma, e confirmamos se o caso é compatível com coleta. Depois, o agendamento da retirada em janela combinada. Na coleta, o equipamento é identificado e os acessórios recebidos são registrados — fonte, cabo, carregador, base — para que a devolução confira item a item. Por último, o diagnóstico em bancada e a apresentação do valor.",
          "Nada é executado por conta própria. Após o recebimento fazemos o diagnóstico e a execução só acontece depois da sua aprovação do valor do serviço. Peças e componentes, quando necessários, ficam fora do valor-base e também dependem de autorização expressa antes da compra."
        ]
      },
      {
        "titulo": "Valores, taxa mínima e regra da estimativa",
        "paragrafos": [
          "A coleta e entrega está inclusa no valor do reparo quando o serviço é aprovado. A taxa mínima pré-aprovada dessa modalidade é de R$ 299,99, e ela existe porque envolve deslocamento em duas pontas, transporte com responsabilidade sobre o equipamento e ocupação de bancada.",
          "Estimativa gratuita somente via WhatsApp: pelo relato do sintoma conseguimos indicar o cenário provável e a faixa de trabalho, mas valor preciso só existe com compromisso, depois que o equipamento é aberto e testado. Preferimos dizer isso antes a inventar um número por telefone e corrigir depois.",
          "Se você desistir após o diagnóstico, paga apenas o valor do diagnóstico, R$ 99,99, e agendamos a devolução do equipamento no mesmo estado em que foi recebido, com os acessórios registrados na coleta. As regras completas de pagamento e emissão de nota fiscal estão descritas na página de preços e políticas."
        ]
      },
      {
        "titulo": "Prazos reais por tipo de equipamento",
        "paragrafos": [
          "Celular, rádio e caixa de som: 2 a 3 dias úteis. TV, monitor, notebook e PC: 15 a 60 dias úteis. Esses prazos não são estimativa de marketing — refletem fila do laboratório, tempo de teste e, principalmente, disponibilidade de peça compatível, que é o fator que mais alonga reparo em equipamento antigo ou com componente descontinuado.",
          "O prazo depende do tipo de falha. Serviço de software, limpeza e reinstalação de sistema costuma sair muito antes do limite superior da faixa. Reparo em nível de placa, dano por líquido e substituição de tela dependem de importação ou de fornecedor específico e ficam na parte alta da faixa.",
          "Sempre que o prazo estimado mudar durante o serviço, você é avisado com o motivo — peça atrasada, falha adicional encontrada em teste ou necessidade de observação prolongada em defeito intermitente. Preferimos comunicar a mudança a deixar você sem previsão."
        ]
      },
      {
        "titulo": "Cuidados com o equipamento e com seus dados",
        "paragrafos": [
          "O equipamento é identificado na retirada e mantido sob controle durante todo o serviço. Recomendamos backup antes de qualquer intervenção que envolva armazenamento, e quando possível fazemos cópia preventiva. O acesso a arquivos se limita ao necessário para o serviço autorizado.",
          "Esta modalidade não inclui visita técnica de reparo a domicílio: o serviço é realizado em laboratório, com coleta e entrega. Se o seu caso pode ser resolvido no local ou por acesso remoto, dizemos isso na triagem e indicamos a modalidade mais barata para você — não empurramos coleta quando ela não é necessária."
        ]
      }
    ],
    "faq": [
      {
        "pergunta": "Quais equipamentos podem usar a coleta e entrega?",
        "resposta": "Computadores de mesa e notebooks que precisam de diagnóstico, manutenção ou reparo em bancada. É a modalidade indicada quando o serviço não pode ser concluído no local."
      },
      {
        "pergunta": "Quando a coleta é mais adequada que o atendimento no local?",
        "resposta": "Quando o caso exige bancada, ferramentas específicas ou tempo estendido de diagnóstico — por exemplo reparo de placa, troca de tela ou recuperação de dados."
      },
      {
        "pergunta": "Como funciona o agendamento?",
        "resposta": "Fazemos uma triagem pelo WhatsApp antes de agendar. Na coleta, identificamos o equipamento e registramos os acessórios recebidos. A taxa mínima pré-aprovada é de R$ 299,99."
      },
      {
        "pergunta": "O reparo é executado direto?",
        "resposta": "Não. Após o recebimento fazemos o diagnóstico e a execução só acontece depois da sua aprovação do valor do serviço. Peças e componentes, quando necessários, ficam fora do valor-base."
      },
      {
        "pergunta": "Qual o prazo?",
        "resposta": "Celular / Rádio / Caixa de Som: 2 a 3 dias úteis. TV / Monitor / Notebook / PC: 15 a 60 dias úteis. O prazo depende do tipo de falha e da fila do laboratório."
      },
      {
        "pergunta": "E se eu desistir após o diagnóstico?",
        "resposta": "Você paga apenas o valor do diagnóstico (R$ 99,99) e agendamos a devolução do equipamento."
      }
    ]
  },

  {
    "path": "/diagnostico-tecnico",
    "title": "Diagnóstico Técnico de Computador e Notebook em Curitiba",
    "description": "Diagnóstico técnico para identificar falhas em computadores e notebooks, avaliar a viabilidade do serviço e orientar o valor."
  },
  {
    "path": "/areas-atendidas",
    "title": "Áreas Atendidas em Curitiba e Região | Bairros e Cidades",
    "description": "Bairros de Curitiba e cidades da região metropolitana atendidas pelo Técnico em Curitiba, com a modalidade indicada em cada caso: no local, remoto ou coleta.",
    "blocos": [
      {
        "titulo": "O que esta página resolve",
        "paragrafos": [
          "Antes de agendar, a dúvida mais comum é simples: o atendimento chega até o meu endereço? Esta página responde isso de forma direta, listando os bairros de Curitiba com maior volume de chamados e as cidades da região metropolitana cobertas, sem promessa de tempo de chegada e sem endereço de loja que não existe.",
          "A cobertura é organizada por região porque é assim que a agenda funciona na prática. Cada região tem um perfil de chamado dominante, e esse perfil ajuda a definir a modalidade correta antes mesmo do primeiro contato: atendimento no endereço, suporte remoto ou coleta do equipamento para bancada."
        ]
      },
      {
        "titulo": "Curitiba: bairros e regiões",
        "paragrafos": [
          "A região central concentra escritórios, consultórios e comércio, onde o atendimento é agendado para não interromper o expediente. A zona sul reúne o maior volume residencial e de home office, com pedidos de formatação, troca por SSD, limpeza interna e Wi-Fi instável. Oeste e CIC misturam indústria, comércio e condomínios, o que puxa manutenção de parque de máquinas e rede.",
          "Norte e leste concentram residências, estudantes e profissionais liberais, com urgência maior em recuperar arquivos e voltar a produzir no mesmo dia. Santa Felicidade e o entorno têm deslocamento mais longo, então a agenda considera a rota do dia e casos de bancada saem por coleta.",
          "Bairros com página local própria trazem detalhes específicos de operação. Os bairros sem página dedicada são atendidos normalmente — a ausência de página não significa ausência de atendimento."
        ]
      },
      {
        "titulo": "Região metropolitana",
        "paragrafos": [
          "Fora de Curitiba, o atendimento segue exatamente a mesma regra: triagem primeiro, modalidade definida pelo sintoma, valor aprovado antes da execução e garantia de 90 dias na mão de obra do serviço realizado. O suporte remoto é imediato em qualquer cidade da lista; o presencial depende de confirmação de agenda e deslocamento.",
          "Para empresas da região metropolitana, a combinação mais eficiente costuma ser suporte remoto no dia a dia com visitas programadas apenas para o que exige presença física, evitando deslocamento desnecessário e parada de operação."
        ]
      },
      {
        "titulo": "Como a modalidade é definida",
        "paragrafos": [
          "Problemas de sistema, configuração, lentidão por software, e-mail e acesso a programas costumam ser resolvidos remotamente, sem deslocamento. Rede, Wi-Fi, cabeamento e vários equipamentos no mesmo local pedem atendimento presencial. Reparo de placa, tela, conector de energia, TV e monitor exige bancada, e nesse caso o equipamento é coletado, avaliado e devolvido.",
          "O diagnóstico técnico parte de R$ 99,99 em toda a área atendida. Deslocamentos mais longos na região metropolitana podem alterar a janela de agenda e, em alguns casos, o valor do atendimento presencial — sempre informado e aprovado antes, nunca depois do serviço."
        ]
      }
    ]
  },
  {
    "path": "/equipamentos-atendidos",
    "title": "Equipamentos Atendidos | Técnico em Curitiba",
    "description": "Notebooks, desktops, PC gamer, All in One, estações de trabalho, equipamentos de home office, redes e armazenamento: o que atendemos em Curitiba, os limites.",
    "blocos": [
      {
        "titulo": "Como usar esta página",
        "paragrafos": [
          "Cada bloco desta página funciona como uma porta de entrada: você identifica o seu equipamento, confere se o sintoma aparece na lista de problemas comuns e segue para a página do serviço que executa o reparo. A indicação de modalidade evita a frustração mais comum da assistência técnica — marcar uma visita para um problema que só se resolve em bancada, ou levar o equipamento para algo que se resolveria remotamente.",
          "Os limites declarados em cada categoria não são ressalva burocrática: são o resultado real da avaliação técnica. Peça sem reposição, mídia com dano severo e equipamento fora da nossa capacidade operacional são informados antes, e não depois do serviço iniciado."
        ]
      },
      {
        "titulo": "Computadores, notebooks e máquinas de alto desempenho",
        "paragrafos": [
          "Notebooks e ultrabooks das marcas de mercado chegam com lentidão, superaquecimento, bateria que não segura carga, teclado e dobradiça danificados ou disco em fim de vida. Casos de software resolvem remotamente ou no local; falha física normalmente exige coleta e bancada.",
          "Desktops apresentam lentidão, reinício espontâneo, ruído por poeira, fonte instável e sistema corrompido — boa parte resolvida em visita ao endereço. PC gamer e All in One exigem atenção extra: o primeiro por temperatura e estabilidade sob carga, o segundo por ventilação restrita e peças específicas do modelo, nem sempre disponíveis para reposição."
        ]
      },
      {
        "titulo": "Redes, armazenamento e posto de trabalho",
        "paragrafos": [
          "Em redes, tratamos roteadores, access points, mesh, repetidores e switches compatíveis: Wi-Fi fraco em parte do imóvel, canal congestionado, firmware antigo e compartilhamento instável. Obra, passagem de cabo e ponto de rede novo são avaliados à parte, e falha do provedor é responsabilidade da operadora.",
          "Em armazenamento, atendemos HD mecânico, SSD SATA e NVMe, HD externo, pendrive e cartão de memória, sempre com avaliação física antes de qualquer previsão — recuperação é tentativa, não garantia. No posto de home office, cuidamos de monitor adicional, dock, teclado, mouse, headset, webcam e impressora já compatível."
        ]
      },
      {
        "titulo": "Equipamentos sujeitos a avaliação e o que fica fora do escopo",
        "paragrafos": [
          "Alguns casos não têm resposta antes do teste: MacBook, equipamento com histórico de dano por líquido, máquina com bloqueio de conta do fabricante, placa com sinal de queima e mídias com falha física. Nessas situações a avaliação vem primeiro e o encaminhamento é decidido depois, inclusive a indicação de assistência especializada quando for o caminho correto.",
          "Fora do escopo: celulares, televisores, equipamentos de áudio e vídeo, eletrodomésticos, CFTV, videogames, impressora como vertical de reparo independente, equipamentos industriais e tablets, exceto configurações já ligadas ao ambiente atendido. Listar aparelhos fora da capacidade real geraria expectativa que não conseguiríamos cumprir."
        ]
      },
      {
        "titulo": "Modalidades de atendimento por tipo de equipamento",
        "paragrafos": [
          "Problema de sistema, configuração ou programa costuma resolver por atendimento remoto. Rede, instalação e verificação inicial funcionam bem em atendimento no domicílio. Falha física, troca de peça e testes prolongados pedem coleta e entrega, com bancada e ambiente controlado.",
          "Em caso de dúvida, o diagnóstico técnico explica como a causa é confirmada, e a página sobre quando não compensa reparar ajuda na decisão entre consertar e substituir o equipamento."
        ]
      }
    ],
    "faq": [
      {
        "pergunta": "Vocês atendem qualquer marca de notebook e computador?",
        "resposta": "Atendemos as marcas de mercado mais comuns em Curitiba, como Dell, Lenovo, HP, Acer, Asus, Samsung, Positivo e máquinas montadas. O que define a viabilidade não é a marca, e sim a disponibilidade de peça e o resultado da avaliação técnica."
      },
      {
        "pergunta": "MacBook está incluído?",
        "resposta": "Somente mediante avaliação prévia. Parte dos serviços de sistema, arquivos e configuração é possível, mas reparos que dependem de peça específica ou ferramenta proprietária podem ser encaminhados para assistência especializada. Confirme o caso na triagem antes de agendar."
      },
      {
        "pergunta": "Por que televisores e celulares não estão na lista?",
        "resposta": "Porque este portal trabalha com informática: computadores, notebooks, redes, armazenamento e o posto de trabalho. Listar aparelhos fora dessa capacidade real geraria expectativa que não conseguiríamos cumprir."
      },
      {
        "pergunta": "Como sei qual modalidade de atendimento serve para o meu equipamento?",
        "resposta": "Depende do sintoma. Problema de sistema, configuração ou programa costuma resolver por atendimento remoto. Rede, instalação e verificação inicial funcionam bem em domicílio. Falha física, troca de peça e recuperação de dados pedem coleta e bancada."
      },
      {
        "pergunta": "Vocês atendem mais de um equipamento na mesma visita?",
        "resposta": "Sim. Informe na triagem a quantidade de máquinas e o problema de cada uma, porque isso define o tempo previsto e o escopo do atendimento, combinados antes do agendamento."
      },
      {
        "pergunta": "Equipamento muito antigo ainda vale a pena consertar?",
        "resposta": "Nem sempre. Quando o custo do reparo se aproxima do valor de um equipamento equivalente, orientamos a substituição. Essa análise faz parte do diagnóstico e está detalhada na página sobre quando não compensa reparar."
      }
    ]
  },
  {
    "path": "/guia-tecnico-informatica",
    "title": "Guia Técnico: Manutenção de PC e Notebook Passo a Passo",
    "description": "Guia completo de manutenção de computador e notebook: como identificar a família da falha, o que verificar antes de chamar o técnico, quando o upgrade compensa.",
    "h1": "Guia técnico de informática: manutenção de PC e notebook",
    "subtitulo": "Como separar as famílias de falha de um computador ou notebook, o que verificar antes do atendimento, quando o upgrade muda o desempenho e quando o reparo deixa de compensar.",
    "blocos": [
      {
        "titulo": "As seis famílias de falha",
        "paragrafos": [
          "Quase todo problema de informática cabe em seis famílias: energia, imagem, desempenho, sistema e software, armazenamento e dados, rede e conectividade. Classificar corretamente evita trocar peça por tentativa ou formatar por padrão.",
          "A triagem no WhatsApp começa por aqui: você descreve o comportamento, a família provável é identificada e só então a modalidade de atendimento é indicada — remoto, em domicílio ou com coleta para bancada."
        ]
      },
      {
        "titulo": "Checklist antes de chamar o técnico",
        "paragrafos": [
          "Nenhum item exige abrir o equipamento: anotar quando o problema começou e o que mudou antes, testar outra tomada aterrada, desconectar periféricos, observar LEDs e ruídos, conferir o espaço livre do disco e notar se a lentidão aparece logo ou depois de alguns minutos.",
          "O que evitar: abrir fonte, insistir em ligar equipamento que teve contato com líquido, forçar conectores, instalar otimizadores baixados por anúncio e reinstalar o sistema com suspeita de disco falhando."
        ]
      },
      {
        "titulo": "O que realmente melhora o desempenho",
        "paragrafos": [
          "SSD no lugar do HD mecânico é a intervenção de maior impacto perceptível. Ampliação de memória é indicada quando a máquina trava com muitos programas abertos, respeitando o limite suportado pela placa.",
          "Limpeza interna com troca de pasta térmica resolve a lentidão ligada ao aquecimento. Formatação resolve o que é software e não corrige disco lento nem falta de memória.",
          "A compatibilidade é conferida antes da compra de qualquer peça e o valor é aprovado por você antes da execução."
        ]
      },
      {
        "titulo": "Dados, backup e diagnóstico",
        "paragrafos": [
          "Em qualquer atendimento, os dados valem mais que o equipamento. Com ruído metálico, travamentos de leitura ou partição não reconhecida, a orientação é parar de usar o equipamento para não sobrescrever o que ainda pode ser lido.",
          "O diagnóstico segue cinco etapas: triagem no WhatsApp, definição da modalidade, avaliação técnica por eliminação, aprovação do que será feito e do valor, execução e entrega com registro do serviço."
        ]
      }
    ],
    "faq": [
      {
        "pergunta": "Como sei se o problema é de hardware ou de software?",
        "resposta": "O padrão do sintoma ajuda. Falha que aparece antes do sistema carregar — sem imagem, bipes, desligamento imediato, não ligar — aponta para hardware. Problema que só ocorre depois da área de trabalho carregar, com erros, lentidão ou programas indesejados, aponta para software. A confirmação só vem com o equipamento avaliado."
      },
      {
        "pergunta": "Vale a pena consertar um computador antigo?",
        "resposta": "Depende da relação entre o custo do reparo e o valor de um equipamento equivalente. Quando a soma de peças se aproxima desse valor, ou quando a placa não suporta mais memória e o processador limita o uso pretendido, explicamos o cenário e a alternativa, incluindo a migração dos seus dados."
      },
      {
        "pergunta": "Formatar resolve lentidão?",
        "resposta": "Resolve quando a causa é software. Se o gargalo é HD mecânico, memória insuficiente ou aquecimento, a máquina volta a ficar lenta pouco tempo depois da formatação. Por isso a lentidão é investigada por família de causa antes de definir o procedimento."
      },
      {
        "pergunta": "Meus arquivos correm risco durante a manutenção?",
        "resposta": "O procedimento é sempre combinado antes. Quando há suspeita de falha de disco, a prioridade é preservar os dados antes de qualquer tentativa de reparo. Em formatação, o backup é tratado como etapa obrigatória do serviço, e não como opcional."
      },
      {
        "pergunta": "O atendimento pode ser feito sem sair de casa?",
        "resposta": "Boa parte dos casos de sistema, configuração e programa é resolvida por atendimento remoto. Rede, instalação e verificação inicial funcionam bem em domicílio. Falha física, troca de peça e recuperação de dados pedem bancada, com coleta e entrega quando necessário."
      },
      {
        "pergunta": "Quanto tempo demora uma manutenção de computador ou notebook?",
        "resposta": "Depende da família da falha. Serviços de sistema, configuração e remoção de programas indesejados costumam ser resolvidos no mesmo atendimento. Reparo com troca de peça depende da disponibilidade do componente. Avaliação de disco com falha é o caso mais longo, porque a leitura é feita em etapas para não agravar o problema. O prazo estimado é informado na aprovação, antes da execução."
      },
      {
        "pergunta": "Trocar HD por SSD faz diferença em um computador antigo?",
        "resposta": "Na maior parte dos casos de lentidão em máquina com disco mecânico, é a intervenção de maior impacto percebido: o tempo de inicialização e a abertura de programas caem de forma evidente. O SSD não resolve travamento por superaquecimento nem falta de memória, então a avaliação verifica o conjunto antes de recomendar apenas a troca."
      },
      {
        "pergunta": "Notebook desligando sozinho é sempre superaquecimento?",
        "resposta": "Não. Desligamento repentino aparece em aquecimento, mas também em fonte ou carregador inadequado, bateria degradada, falha de alimentação da placa e até em erro de sistema. O que separa os cenários é o momento em que ocorre: sob esforço, logo ao ligar ou em qualquer situação. Essa informação é pedida já na triagem."
      },
      {
        "pergunta": "Preciso levar o equipamento ou o atendimento pode ser em casa?",
        "resposta": "Sistema, configuração e programas normalmente são resolvidos por atendimento remoto. Rede, impressora e verificação inicial funcionam bem em domicílio. Falha física, troca de peça, microssoldagem e recuperação de dados exigem bancada, com coleta e entrega quando necessário. A modalidade é definida na triagem, não depois."
      }
    ]
  },
  {
    "path": "/problemas/computador-lento",
    "title": "Computador Lento? Diagnóstico Técnico em Curitiba",
    "description": "Computador ou notebook lento para ligar e abrir programas? Veja os sintomas, as causas possíveis, quando SSD ou memória resolvem, quando formatar e quando trocar.",
    "h1": "Computador lento: sintomas, causas possíveis e o que realmente resolve",
    "subtitulo": "Lentidão quase nunca tem uma causa única: armazenamento, memória, temperatura e software se manifestam de formas diferentes e exigem soluções diferentes.",
    "blocos": [
      {
        "titulo": "Lentidão é sintoma, não diagnóstico",
        "paragrafos": [
          "Existem quatro famílias de causa bem diferentes: armazenamento, memória, temperatura e software. Demora para ligar aponta para o disco; travar com vários programas abertos aponta para memória; piorar com o tempo de uso aponta para aquecimento; ficar lento de repente após uma atualização aponta para software.",
          "A triagem pergunta quando a lentidão aparece e o que está aberto no momento. Ela orienta a modalidade de atendimento, mas a causa só é confirmada com o equipamento avaliado."
        ]
      },
      {
        "titulo": "O que você pode observar antes do atendimento",
        "paragrafos": [
          "Reiniciar e notar se a lentidão aparece logo ou depois de um tempo, conferir o espaço livre do disco do sistema, observar aquecimento e ruído do cooler, anotar quais programas estão abertos e se o problema também ocorre sem internet.",
          "O que não recomendamos: instalar \"otimizadores\" baixados por anúncio, acumular mais de um antivírus e desativar serviços do sistema por tutorial."
        ]
      },
      {
        "titulo": "O que resolve cada tipo de causa",
        "paragrafos": [
          "Instalação de SSD é a intervenção de maior impacto quando o sistema ainda roda em HD mecânico. Ampliação de memória é indicada quando a máquina trava com muitos programas abertos, respeitando o limite suportado pela placa.",
          "Limpeza interna resolve a lentidão ligada ao aquecimento. Formatação resolve o que é software — sistema corrompido, infecção persistente ou acúmulo de instalações — e não corrige disco lento nem falta de memória.",
          "Quando a placa não suporta mais memória, quando o processador limita o uso pretendido ou quando a soma das peças se aproxima do valor de um equipamento equivalente, explicamos o cenário e a alternativa, incluindo a migração dos seus dados."
        ]
      }
    ]
  },
  {
    "path": "/problemas/tela-azul-windows",
    "title": "Tela Azul no Windows? Diagnóstico Técnico em Curitiba",
    "description": "Tela azul recorrente no Windows: o que o código de erro indica, quais causas são de memória, disco, driver ou temperatura, o que anotar antes do atendimento.",
    "h1": "Tela azul no Windows: o que o código indica e como o diagnóstico é feito",
    "subtitulo": "Tela azul não é um defeito: é o sistema interrompendo a execução para evitar dano maior. O que importa é o que provocou a interrupção — memória, disco, driver, temperatura ou alimentação.",
    "blocos": [
      {
        "titulo": "O que a tela azul realmente informa",
        "paragrafos": [
          "O código exibido não nomeia a peça defeituosa: ele indica em qual camada a operação falhou. Dois equipamentos com o mesmo código podem ter causas completamente diferentes.",
          "O que dá direção ao diagnóstico é o padrão de repetição: falha aleatória, falha só sob carga, falha durante o boot e falha logo após uma instalação apontam para grupos distintos."
        ]
      },
      {
        "titulo": "Grupos de código de erro e o que investigam",
        "paragrafos": [
          "MEMORY_MANAGEMENT e PAGE_FAULT_IN_NONPAGED_AREA orientam a verificação de memória; CRITICAL_PROCESS_DIED e INACCESSIBLE_BOOT_DEVICE apontam para sistema e armazenamento.",
          "VIDEO_TDR_FAILURE e DPC_WATCHDOG_VIOLATION direcionam para driver e resposta de dispositivo; WHEA_UNCORRECTABLE_ERROR e CLOCK_WATCHDOG_TIMEOUT envolvem temperatura, alimentação e estabilidade elétrica."
        ]
      },
      {
        "titulo": "O que você pode registrar antes do atendimento",
        "paragrafos": [
          "Fotografar o código de erro, registrar o que estava sendo feito, lembrar de instalações e atualizações recentes, observar aquecimento antes do reinício e contar quantas vezes a falha ocorre por dia.",
          "O que não recomendamos: reinstalar o Windows por conta própria com suspeita de disco, aplicar \"correções de registro\" baixadas por anúncio e forçar atualização de BIOS sem confirmar o modelo da placa."
        ]
      },
      {
        "titulo": "O que resolve cada tipo de causa",
        "paragrafos": [
          "Teste de memória em ciclos confirma ou descarta módulo com falha antes de qualquer troca. Leitura de saúde do armazenamento vem antes de reinstalação quando há suspeita de disco.",
          "Correção de driver e de arquivos de sistema resolve boa parte dos casos sem trocar peça. Limpeza interna entra quando a falha aparece apenas sob carga.",
          "Formatar resolve o que é sistema; não corrige memória com defeito, disco sem saúde, superaquecimento nem fonte insuficiente."
        ]
      }
    ]
  },
  {
    "path": "/problemas/notebook-superaquecendo",
    "title": "Notebook Superaquecendo? Diagnóstico Técnico em Curitiba",
    "description": "Notebook esquentando, com cooler acelerado ou desligando sozinho: entenda o que é temperatura normal, quais causas são de poeira, pasta térmica, uso ou falha.",
    "h1": "Notebook superaquecendo: o que investigar antes de trocar qualquer peça",
    "subtitulo": "Notebook quente não é necessariamente notebook com defeito. O que importa é se ele sustenta o esforço sem perder desempenho e sem desligar.",
    "blocos": [
      {
        "titulo": "Quente ou superaquecendo? A diferença prática",
        "paragrafos": [
          "Aquecer sob esforço, com cooler acelerando e voltando ao normal depois, é o funcionamento esperado. O problema começa quando a temperatura passa a limitar o uso.",
          "Três sinais indicam que o limite foi atingido: queda progressiva de desempenho, desligamento sem aviso sob carga e cooler no máximo mesmo em tarefas leves."
        ]
      },
      {
        "titulo": "Geração de calor e dissipação são lados diferentes",
        "paragrafos": [
          "De um lado está o que o equipamento processa, como está alimentado e qual perfil de energia está ativo. Do outro, poeira no dissipador, pasta térmica ressecada, ventoinha desgastada e obstrução das entradas de ar.",
          "Tratar apenas um dos lados é o motivo mais comum de o problema voltar poucas semanas depois do atendimento."
        ]
      },
      {
        "titulo": "O que você pode observar antes do atendimento",
        "paragrafos": [
          "Usar o notebook sobre superfície rígida por alguns dias, notar onde o calor concentra, observar se o cooler acelera antes do travamento, anotar os programas abertos e conferir se há fluxo de ar na saída.",
          "O que não recomendamos: soprar ar comprimido travando as pás da ventoinha, abrir o equipamento por tutorial de outro modelo e insistir no uso com bateria estufada ou cheiro de plástico aquecido."
        ]
      },
      {
        "titulo": "O que resolve cada tipo de causa",
        "paragrafos": [
          "Limpeza interna com troca de pasta térmica é a intervenção de maior efeito em equipamentos há anos sem manutenção. Substituição de ventoinha entra quando a rotação segue baixa depois da limpeza.",
          "Revisão de programas em segundo plano reduz calor gerado por consumo. Avaliação de bateria e carregador cobre os casos de desligamento sob esforço que não são térmicos.",
          "Bateria estufada, carcaça deformada ou cheiro de queimado exigem interrupção imediata do uso e avaliação antes de qualquer reparo."
        ]
      }
    ]
  },
  {
    "path": "/problemas/notebook-nao-carrega-bateria",
    "title": "Notebook Não Carrega a Bateria? Diagnóstico em Curitiba",
    "description": "Notebook conectado à tomada mas sem carregar, parado em uma porcentagem fixa ou funcionando só no cabo: entenda o que é bateria, carregador, conector de energia.",
    "h1": "Notebook não carrega a bateria: como separar bateria, carregador e placa",
    "subtitulo": "Entre a tomada e a célula existem cabo, fonte, conector, circuito de carga e controlador. Cada etapa falha de um jeito diferente e produz o mesmo sintoma visível: a porcentagem que não sobe.",
    "blocos": [
      {
        "titulo": "O caminho da energia até a bateria",
        "paragrafos": [
          "A energia passa por cinco etapas antes de chegar à célula: tomada e cabo, fonte externa, conector de alimentação na carcaça, circuito de carga na placa e o controlador que decide quando carregar.",
          "Substituir a bateria com o conector rompido não resolve, e trocar o carregador com o circuito de carga danificado também não. O diagnóstico segue esse caminho, do mais barato de descartar ao mais complexo."
        ]
      },
      {
        "titulo": "Sintomas que separam as causas",
        "paragrafos": [
          "\"Conectado, não carregando\" indica que energia chega e o bloqueio está na etapa de carga. Desligar na hora ao remover o cabo aponta bateria sem capacidade ou contato interno rompido.",
          "Carga travada em porcentagem fixa pode ser limite configurado pelo fabricante. Carga que aparece e some ao mexer no cabo direciona para conector de energia, não para a bateria."
        ]
      },
      {
        "titulo": "O que você pode verificar antes do atendimento",
        "paragrafos": [
          "Testar em outra tomada sem extensão, observar o LED de carga, anotar a mensagem exibida pelo sistema, verificar se o cabo esquenta e checar se há limite de carga habilitado no aplicativo do fabricante.",
          "O que não recomendamos: emendar cabo rompido com fita, usar fonte de outro modelo sem conferir tensão e corrente e insistir na carga com carcaça deformada ou aquecimento anormal."
        ]
      },
      {
        "titulo": "O que resolve cada tipo de causa",
        "paragrafos": [
          "Leitura de saúde da bateria separa desgaste real de bloqueio por outro motivo. Teste de carregador identifica fonte de potência inferior, causa frequente de carga lenta ou inexistente.",
          "Ressolda do conector de energia atende os casos de carga intermitente. Quando bateria e fonte estão saudáveis, a investigação passa ao circuito de carga da placa, com medição ponto a ponto.",
          "Bateria estufada, carcaça deformada ou aquecimento na região da bateria exigem interrupção imediata do uso e avaliação antes de nova tentativa de carga."
        ]
      }
    ]
  },
  {
    "path": "/problemas/tv-nao-liga",
    "title": "TV Não Liga? Diagnóstico Técnico de TV em Curitiba",
    "description": "TV que não liga, com LED piscando, som sem imagem ou desligando sozinha: entenda o que é fonte, placa principal, backlight ou painel, o que verificar.",
    "h1": "TV não liga: como separar fonte, placa, iluminação e painel",
    "subtitulo": "Em uma TV, \"não liga\" descreve pelo menos quatro situações diferentes, e cada uma leva a um custo e a um desfecho distintos.",
    "blocos": [
      {
        "titulo": "Os quatro cenários por trás de \"a TV não liga\"",
        "paragrafos": [
          "Ausência total de reação concentra a suspeita na fonte. LED aceso sem partida direciona à placa principal, porque a energia de espera existe mas a inicialização não completa.",
          "Som funcionando com tela escura costuma ser iluminação da tela, não painel queimado — é o cenário com melhor desfecho de reparo. Painel trincado ou com mancha extensa não tem conserto que compense."
        ]
      },
      {
        "titulo": "Causas mais frequentes nos atendimentos de TV",
        "paragrafos": [
          "Capacitores da fonte com perda de característica, proteção de entrada aberta após oscilação da rede e etapa de iluminação com uma barra interrompida respondem pela maior parte dos casos.",
          "Firmware corrompido por atualização interrompida, cabo flat com mau contato e configuração de temporizador também aparecem, e são as hipóteses mais baratas de descartar."
        ]
      },
      {
        "titulo": "O que você pode verificar antes do atendimento",
        "paragrafos": [
          "Testar em outra tomada sem filtro de linha, contar as piscadas do LED, tentar ligar pelo botão físico e, no escuro, iluminar a tela de lado com lanterna para ver se aparece imagem apagada.",
          "O que não recomendamos: abrir o gabinete por conta própria, já que há componentes que retêm carga mesmo fora da tomada, e apoiar a TV deitada sobre a tela."
        ]
      },
      {
        "titulo": "O que resolve cada tipo de causa e quando recusamos o serviço",
        "paragrafos": [
          "Reparo de fonte é a intervenção mais frequente e a de melhor relação custo-benefício após oscilação elétrica. Reparo de placa principal depende de medição ponto a ponto antes de qualquer promessa.",
          "Reparo da iluminação da tela atende o clássico \"som sim, imagem não\", dependendo da disponibilidade do conjunto compatível. Não trocamos painel: a peça vale quase o aparelho.",
          "Garantia de 90 dias sobre a mão de obra, restrita ao defeito tratado. Peças seguem a garantia do fornecedor. Não há atendimento em balcão: o aparelho é retirado e devolvido no endereço combinado."
        ]
      }
    ]
  },

  {
    "path": "/problemas/computador-desliga-sozinho",
    "title": "Computador Desliga Sozinho? Diagnóstico em Curitiba",
    "description": "Computador ou notebook que desliga sozinho, reinicia do nada ou apaga durante jogos: entenda a diferença entre temperatura, fonte, energia e software.",
    "h1": "Computador desliga sozinho: temperatura, fonte, energia ou software",
    "subtitulo": "O jeito como o equipamento apaga já separa quatro grupos de causa, e tratar tudo como superaquecimento é o que mais gera troca de peça desnecessária.",
    "blocos": [
      {
        "titulo": "Os quatro grupos por trás de \"desliga do nada\"",
        "paragrafos": [
          "O grupo térmico corta a alimentação para proteger o equipamento: desligamento seco, em tempo previsível de uso, pior em tarefa pesada. É o cenário com melhor relação entre custo e resultado.",
          "O grupo de alimentação aparece quando a fonte não sustenta o pico de consumo. O grupo lógico — memória, armazenamento e driver — costuma reiniciar com registro de erro. O quarto grupo é externo: instalação elétrica com queda de tensão, tomada com mau contato ou extensão sobrecarregada."
        ]
      },
      {
        "titulo": "Como o equipamento apaga orienta a investigação",
        "paragrafos": [
          "Desligamento seco significa que a alimentação foi cortada antes de o sistema registrar qualquer coisa. Reinício com aviso indica falha crítica detectada pelo sistema, o que muda completamente o caminho do diagnóstico.",
          "Falha só em jogo ou render aponta dissipação ou fonte no limite. Falha ao mexer no cabo aponta mau contato. Falha em horário de pico da casa move a suspeita para a rede elétrica do imóvel."
        ]
      },
      {
        "titulo": "O que você pode observar antes do atendimento",
        "paragrafos": [
          "Anotar se o desligamento é seco ou com aviso de erro, medir em quanto tempo de uso ele acontece, testar outra tomada sem extensão, desconectar periféricos e verificar se a saída de ar está obstruída.",
          "O que não recomendamos: insistir em ligar depois de cheiro de queimado, aplicar pasta térmica sem limpar o dissipador e manter o uso normal com desligamentos diários, porque cada corte abrupto castiga o armazenamento."
        ]
      },
      {
        "titulo": "O que resolve cada causa e quais são as condições",
        "paragrafos": [
          "Limpeza técnica com troca de pasta térmica atende o grupo térmico, com medição de temperatura antes e depois. Avaliação de fonte cobre a falha que só aparece sob carga. Teste de memória e leitura de saúde do disco tratam o grupo lógico.",
          "Reparo em nível de componente fica reservado à interrupção de alimentação dentro da placa, sempre após confirmação de viabilidade. Garantia de 90 dias sobre a mão de obra, restrita ao defeito tratado. Não há atendimento em balcão: coleta e entrega ou visita técnica, conforme o caso."
        ]
      }
    ]
  },

  {
    "path": "/problemas/wifi-caindo-toda-hora",
    "title": "Wi-Fi Caindo Toda Hora? Diagnóstico de Rede em Curitiba",
    "description": "Wi-Fi que cai toda hora, sinal que some em um cômodo ou internet lenta só à noite: entenda a diferença entre falha do provedor, do roteador e da cobertura.",
    "h1": "Wi-Fi caindo toda hora: provedor, roteador ou cobertura",
    "subtitulo": "A causa mais comum de rede instável não é defeito do provedor nem do roteador, e sim cobertura mal distribuída dentro do imóvel.",
    "blocos": [
      {
        "titulo": "Os três cenários por trás de \"o Wi-Fi cai\"",
        "paragrafos": [
          "Queda de link derruba todos os aparelhos ao mesmo tempo, inclusive os ligados por cabo, e nenhum ajuste interno corrige isso: o caminho é registrar horários e abrir chamado com a operadora.",
          "Limitação do equipamento aparece quando o número de dispositivos cresce e a rede trava no horário de maior uso. Cobertura é o cenário mais frequente: o link está estável, mas o sinal não chega com qualidade ao cômodo onde você precisa."
        ]
      },
      {
        "titulo": "Sintomas que ajudam a separar as causas",
        "paragrafos": [
          "Queda simultânea em todos os aparelhos tira a suspeita do dispositivo. Perda de sinal em um único cômodo indica falta de cobertura, não queda de link. Conectar sem navegar aponta atribuição de endereço ou o próprio provedor.",
          "Piora à noite combina mais dispositivos em casa com mais interferência das redes vizinhas. Sinal cheio com travamento em chamada de vídeo é sinal de canal disputado, porque a barra mede intensidade e não qualidade."
        ]
      },
      {
        "titulo": "O que você pode testar antes do atendimento",
        "paragrafos": [
          "Ligar um computador por cabo direto ao roteador é o teste que mais economiza tempo: se o cabo também cai, o problema não é Wi-Fi. Anotar horários das quedas por alguns dias revela padrão de pico.",
          "O que não recomendamos: reiniciar o roteador várias vezes ao dia como rotina, restaurar o padrão de fábrica sem anotar as configurações do provedor e empilhar repetidores, porque cada camada de repetição reduz a velocidade disponível."
        ]
      },
      {
        "titulo": "O que resolve cada causa e quais são as condições",
        "paragrafos": [
          "Reposicionar o roteador, separar as faixas de rádio e escolher canal com menos concorrência resolve boa parte dos casos sem compra de equipamento. Imóvel com laje, sobrado ou edícula pede nós interligados por cabo em vez de repetidor.",
          "Cabeamento estruturado dá estabilidade a televisor, console e computador de trabalho, liberando a faixa sem fio. Rede separada para casa e trabalho reduz concorrência de banda em home office.",
          "Avaliação acontece no local, porque cobertura depende do imóvel. Equipamento só é indicado quando resolve algo concreto. Garantia de 90 dias sobre a mão de obra da configuração e da instalação; instabilidade do link do provedor não está coberta."
        ]
      }
    ]
  },

  {
    "path": "/problemas/tv-com-som-sem-imagem",
    "title": "TV com Som e Sem Imagem? Diagnóstico em Curitiba",
    "description": "Televisor com som normal e tela apagada: entenda a diferença entre falha de backlight, de placa de fonte e de painel, quais testes indicam cada caso e quando.",
    "h1": "TV com som e sem imagem: iluminação, alimentação ou painel",
    "subtitulo": "Televisor que reproduz áudio com a tela apagada quase sempre continua gerando imagem: o que parou foi a iluminação por trás do painel.",
    "blocos": [
      {
        "titulo": "Os três cenários por trás da tela apagada",
        "paragrafos": [
          "Falha da iluminação é o cenário mais frequente em aparelhos com anos de uso: o televisor segue processando vídeo, mas as barras de LED que iluminam o painel pararam de acender. O teste da lanterna costuma revelar isso antes mesmo da coleta.",
          "Falha de alimentação aparece quando a etapa que gera a tensão da iluminação deixa de entregar saída, com piscadas no LED frontal e tentativa de ligar seguida de desligamento. Dano de painel é o único cenário sem reparo viável, e nele emitimos laudo com foto e recusamos o serviço."
        ]
      },
      {
        "titulo": "Sintomas que ajudam a separar as causas",
        "paragrafos": [
          "Som normal com tela totalmente apagada e imagem visível sob a lanterna indicam iluminação. Tela que acende por um segundo e apaga aponta proteção atuando sobre um trecho de LEDs em curto ou sobre a etapa que os alimenta.",
          "Manchas escuras e faixas de brilho irregular sugerem barras com trechos queimados. Linhas verticais ou horizontais fixas mudam a suspeita para conexão do painel ou para o próprio painel, com desfechos bem diferentes."
        ]
      },
      {
        "titulo": "O que você pode verificar antes do atendimento",
        "paragrafos": [
          "Em ambiente escuro, aproxime a lanterna do celular da tela e observe se aparece o menu bem fraco. Troque a fonte de vídeo, teste em outra tomada, conte as piscadas do LED frontal e anote marca e modelo da etiqueta traseira.",
          "O que não recomendamos: abrir a traseira por conta própria, porque a fonte armazena carga mesmo desligada; insistir em ligar e desligar quando o aparelho já entra em proteção; e pressionar a tela para testar o painel, gesto que transforma um reparo comum em dano definitivo."
        ]
      },
      {
        "titulo": "O que resolve cada causa e quais são as condições",
        "paragrafos": [
          "Reparo da iluminação envolve substituição das barras com especificação equivalente e teste de brilho uniforme. Falha na etapa de alimentação é tratada em nível de componente, com medição ponto a ponto, sem trocar a placa inteira por dedução.",
          "Não há atendimento em balcão: o aparelho é coletado no endereço informado, avaliado em bancada e devolvido no mesmo endereço. O reparo só começa depois da aprovação de valor fechado e prazo.",
          "Garantia de 90 dias sobre a mão de obra e as peças aplicadas, limitada ao bloco reparado. Surto elétrico posterior, queda, líquido e intervenção de terceiros ficam fora. Painel danificado não é reparado e recebe laudo com foto."
        ]
      }
    ]
  },

  {
    "path": "/problemas/notebook-molhado",
    "title": "Notebook Molhado? O Que Fazer nas Primeiras Horas | Curitiba",
    "description": "Derramou líquido no notebook? Entenda por que ligar o aparelho piora o quadro, o que fazer nas primeiras horas, como funciona a limpeza de placa e em que casos.",
    "h1": "Notebook molhado: o que fazer nas primeiras horas",
    "subtitulo": "Em aparelho que recebeu líquido, o desfecho é decidido nas primeiras horas — e as três atitudes mais comuns são justamente as que agravam o dano.",
    "blocos": [
      {
        "titulo": "Por que as primeiras horas decidem o resultado",
        "paragrafos": [
          "O dano acontece em duas etapas. A elétrica é imediata: o líquido cria caminho entre pontos de tensão e algo queima ou entra em proteção. Quando o aparelho desliga sozinho, muitas vezes a proteção fez o trabalho dela.",
          "A química é lenta: o resíduo continua reagindo com o cobre das trilhas por dias. É ela que separa o aparelho recuperado com limpeza daquele que exige microssolda semanas depois. Refrigerante, café com açúcar e cerveja aceleram muito esse processo em relação à água."
        ]
      },
      {
        "titulo": "Sintomas e o que cada um costuma indicar",
        "paragrafos": [
          "Desligar na hora e não ligar mais é o quadro com melhor prognóstico quando o aparelho não é religado antes da limpeza. Continuar funcionando normalmente é o mais enganoso: a corrosão avança em silêncio e a falha aparece semanas depois.",
          "Teclas repetindo ou travadas apontam resíduo entre as membranas do teclado. Desligamento após alguns minutos sugere trilha com fuga de corrente. Carregador não reconhecido indica dano na etapa de entrada de energia."
        ]
      },
      {
        "titulo": "Sequência correta logo depois do acidente",
        "paragrafos": [
          "Desligue segurando o botão de energia, retire o carregador da tomada e do aparelho e apoie o notebook com a tela entreaberta para o líquido escorrer. Anote o que foi derramado, a quantidade aproximada e o horário, e acione a coleta o quanto antes.",
          "O que não recomendamos: religar para ver se funciona, usar secador quente, colocar em arroz — que não remove líquido de dentro da placa e ainda deixa resíduo nas aberturas — e desmontar sem ferramenta adequada."
        ]
      },
      {
        "titulo": "O que resolve cada cenário e quais são as condições",
        "paragrafos": [
          "Limpeza técnica de placa, com desmontagem completa, remoção de resíduo e secagem controlada, é o procedimento que mais recupera aparelhos quando feito cedo. Oxidação avançada passa para reparo em nível de componente, com reconstrução de trilha.",
          "Quando o dano fica restrito ao teclado ou aos conectores, a intervenção é mais simples e o prazo mais curto. Se o aparelho não voltar, os arquivos normalmente voltam: a unidade de armazenamento é lida separadamente e a cópia é entregue em mídia à parte.",
          "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. Em caso de líquido não prometemos recuperação: informamos a chance real após a inspeção. Garantia de 90 dias sobre mão de obra e peças aplicadas, limitada ao bloco reparado."
        ]
      }
    ]
  },

  {
    "path": "/problemas/tela-de-notebook-quebrada",
    "title": "Tela de Notebook Quebrada: Troca, Custo e Riscos | Curitiba",
    "description": "Tela trincada, com manchas ou linhas? Entenda a diferença entre painel danificado, cabo flat e placa de vídeo, o que a troca resolve, o que não resolve.",
    "h1": "Tela de notebook quebrada: quando trocar e quando não é a tela",
    "subtitulo": "Nem toda falha de imagem é painel quebrado. Um teste com monitor externo separa três cenários com custos muito diferentes: painel, cabo flat e circuito de vídeo.",
    "blocos": [
      {
        "titulo": "Três cenários que parecem o mesmo defeito",
        "paragrafos": [
          "O painel falha por impacto, pressão ou desgaste e, quando há trinca com mancha escura, o cristal líquido já vazou: não existe reparo parcial, a peça é substituída inteira.",
          "O cabo flat atravessa a dobradiça e se rompe aos poucos com o abre e fecha, produzindo imagem instável que muda conforme o ângulo da tampa. O terceiro cenário está na placa: alimentação do backlight ou controlador de vídeo, com painel íntegro."
        ]
      },
      {
        "titulo": "Sintomas e o que cada um costuma indicar",
        "paragrafos": [
          "Linhas fixas em qualquer imagem apontam painel ou conector; linhas que mudam ao mover a tampa apontam o cabo flat. Tela apagada com imagem fraca visível contra a luz indica falha de iluminação, não de painel.",
          "Vidro estilhaçado com imagem visível é comum em modelos com touch, e a construção (vidro colado ou separado) muda bastante o custo. Dobradiça travada arranca o suporte do painel e rompe o flat com o tempo."
        ]
      },
      {
        "titulo": "Verificações que você mesmo pode fazer",
        "paragrafos": [
          "Ligue um monitor externo: imagem externa perfeita indica problema na tela, no flat ou no conector, não na placa de vídeo. Mova a tampa devagar e observe se a imagem muda. Ilumine a tela apagada com lanterna em ângulo.",
          "O que não recomendamos: pressionar a mancha, colar película sobre vidro estilhaçado e comprar painel pela internet antes do diagnóstico — peça incompatível costuma não ter troca depois de aberta."
        ]
      },
      {
        "titulo": "O que resolve cada cenário e quais são as condições",
        "paragrafos": [
          "Troca do painel por peça de mesma resolução e conector, com teste de ângulo e uniformidade antes de fechar. Quando a falha é do cabo flat, o custo é bem menor — e é por isso que testamos antes. Falha na alimentação do backlight ou no controlador segue para reparo em nível de componente.",
          "Se a troca não compensar diante do valor do aparelho, dizemos isso e a unidade de armazenamento pode ser lida à parte, com os arquivos entregues em mídia separada.",
          "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. Garantia de 90 dias sobre mão de obra e painel aplicado; novo impacto, queda ou pressão sobre a tampa são danos novos e não estão cobertos."
        ]
      }
    ]
  },

{
  "path": "/problemas/notebook-com-tela-preta",
  "title": "Notebook com Tela Preta mas Ligado: O Que Fazer | Curitiba",
  "description": "Notebook liga, ventoinha gira e teclado acende, mas a tela fica preta? Entenda como separar iluminação da tela, cabo interno, vídeo da placa e sistema travado.",
  "h1": "Notebook com tela preta: como descobrir se é a tela, o cabo ou a placa",
  "subtitulo": "O aparelho liga e responde, mas a tela continua escura. Dois testes caseiros separam três causas com custos completamente diferentes.",
  "blocos": [
    {
      "titulo": "Dois testes decidem o rumo do atendimento",
      "paragrafos": [
        "O primeiro é a lanterna: em ambiente escuro, iluminando a tela em ângulo, procure a silhueta dos ícones. Se a imagem existe mas não é iluminada, o problema está na iluminação do painel, um grupo com boa taxa de reparo e sem envolver o vídeo da placa.",
        "O segundo é o monitor externo. Imagem normal na saída de vídeo confirma que processador, memória e vídeo estão trabalhando, e restringe o defeito ao conjunto de tela e ao cabo interno. Sem imagem em nenhuma saída, a avaliação passa a ser de placa, com medição de tensões em bancada."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Tela totalmente escura com ventoinha girando indica que a placa recebeu energia e o ponto de parada está entre a geração da imagem e a tela. Imagem visível apenas sob lanterna aponta para a iluminação do painel.",
        "Imagem normal no monitor externo restringe o defeito ao conjunto de tela. Tela que volta ao mexer na tampa indica cabo interno rompendo na dobradiça. Tela preta logo após atualização costuma ser driver de vídeo incompatível, sem qualquer peça envolvida."
      ]
    },
    {
      "titulo": "Verificações antes de acionar alguém",
      "paragrafos": [
        "Faça o teste da lanterna, conecte um monitor externo alternando a projeção pelo teclado, remova a fonte e mantenha o botão de energia pressionado por trinta segundos, e desconecte periféricos e cartões antes de religar.",
        "O que não recomendamos: apertar a tela para reativar a imagem, aquecer a moldura, desmontar a tampa sem ferramenta adequada e insistir em ligar quando houver cheiro de queimado."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Com imagem no monitor externo, o trabalho concentra-se em cabo, conector e circuito de iluminação do conjunto de tela. Sem imagem em nenhuma saída, medimos as tensões dos circuitos de vídeo e tratamos o ponto com estação de retrabalho, sem substituir a placa inteira.",
        "Quando o hardware responde e a origem é de software, a correção é reversão de driver, reparo da inicialização ou reinstalação limpa preservando arquivos, sempre com aprovação prévia.",
        "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. Nenhuma peça é comprada sem sua aprovação. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado."
      ]
    }
  ]
},
{
  "path": "/problemas/tv-sem-som",
  "title": "TV Sem Som: Causas, Testes e Conserto | Curitiba",
  "description": "TV com imagem normal e sem áudio, som chiado ou saída de fone mudo? Veja como separar configuração de saída, falha do amplificador de áudio e alto-falante rompido.",
  "h1": "TV sem som: ajuste de saída, amplificador de áudio ou alto-falante rompido",
  "subtitulo": "Televisor com imagem normal e nenhum áudio tem três origens bem distintas, e elas se separam com testes gratuitos feitos em poucos minutos.",
  "blocos": [
    {
      "titulo": "O som se perde em um de três pontos",
      "paragrafos": [
        "O áudio percorre um caminho curto: a fonte gera o sinal, o processamento decide por onde ele sai, o amplificador dá potência e os alto-falantes transformam isso em som. Falta de áudio é a interrupção desse caminho em um desses pontos, e cada um tem custo bem diferente.",
        "Por isso o primeiro passo não é fechar valor, é teste de fonte. Silêncio em todas as entradas coloca a suspeita dentro do aparelho. Silêncio em uma só entrega o caso para ajuste de formato, cabo ou aparelho externo, sem reparo nenhum."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Silêncio em TV aberta, HDMI e aplicativo ao mesmo tempo aponta para o circuito de áudio interno. Falha isolada em uma entrada costuma ser formato de áudio incompatível ou cabo com contato ruim.",
        "Som distorcido indica estágio de amplificação em sofrimento ou cone rompido. Perda de apenas um lado aponta para um alto-falante específico. Som no fone ou na barra com alto-falantes mudos prova que o processamento está vivo."
      ]
    },
    {
      "titulo": "Testes antes de acionar alguém",
      "paragrafos": [
        "Teste três fontes diferentes, force a saída para os alto-falantes internos no menu, desative Bluetooth e saída digital, coloque um fone na saída da TV e desconecte barra de som e receptor antes de concluir qualquer coisa.",
        "O que não recomendamos: abrir a traseira do televisor, ligar alto-falante externo direto na placa, insistir em volume alto com som distorcido e transportar o aparelho sem proteção rígida nas bordas."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "A avaliação mede o sinal desde o processamento até a saída dos alto-falantes para descobrir onde ele se perde. Amplificador de áudio e soldas fadigadas são tratados em nível de componente, sem substituir a placa inteira quando o restante está íntegro.",
        "Não adaptamos alto-falante com impedância diferente da original, porque isso força o amplificador e cria defeito novo. Sem a peça correta para o modelo, informamos e devolvemos o aparelho.",
        "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao bloco de áudio reparado; descarga elétrica posterior é dano novo."
      ]
    }
  ]
},
{
  "path": "/problemas/impressora-nao-imprime",
  "title": "Impressora Não Imprime: Causas e Solução | Curitiba",
  "description": "Impressora aparece como offline, aceita o trabalho e não imprime ou sai página em branco? Veja como separar fila travada, driver, rede Wi-Fi e falha mecânica.",
  "h1": "Impressora não imprime: fila travada, driver, rede ou falha mecânica",
  "subtitulo": "A maior parte das impressoras que pararam de funcionar está intacta: o que falhou foi a fila, o driver ou o endereço na rede.",
  "blocos": [
    {
      "titulo": "Impressora falha em quatro camadas diferentes",
      "paragrafos": [
        "Documento, fila, comunicação e mecânica. O arquivo sai do programa, entra na fila do sistema, viaja por cabo ou rede até o aparelho e só então vira papel impresso. Descobrir em qual camada o caminho se interrompeu é o trabalho técnico, e três delas não têm nada de hardware.",
        "É por isso que trocar cartucho costuma ser a primeira reação e quase nunca a solução. Página de teste pelo painel da própria impressora e tentativa de impressão pelo celular dividem o problema ao meio em menos de dois minutos, sem custo."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Status offline com o aparelho ligado é quase sempre endereço novo na rede após queda de energia. Documento parado na fila trava todos os seguintes sem que exista defeito de hardware.",
        "Página em branco em jato de tinta aponta para cabeça entupida por falta de uso; em laser, para toner mal encaixado ou cilindro no fim. Atolamento sempre no mesmo ponto indica rolete desgastado ou papel preso de uma remoção anterior."
      ]
    },
    {
      "titulo": "Testes antes de comprar suprimento",
      "paragrafos": [
        "Cancele a fila e reinicie a impressora pela tomada, confira se a impressora padrão é o aparelho físico e não um dispositivo virtual de PDF, imprima a página de teste pelo painel e tente imprimir pelo celular na mesma rede.",
        "O que não recomendamos: forçar o carro de impressão com a mão, lavar cabeçote com produtos improvisados e puxar papel preso contra o sentido do mecanismo, o que costuma quebrar dentes de engrenagem."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Boa parte dos chamados termina sem peça: reinstalação limpa do driver, correção da porta de impressão e fixação do endereço na rede para o problema não voltar na próxima queda de energia. Atolamento repetido e ruído de engrenagem exigem avaliação em bancada.",
        "Quando a troca de cabeçote se aproxima do valor de uma impressora equivalente, orientamos não fazer o serviço. Cartucho e toner seguem a garantia do fabricante.",
        "Atendimento no local, remoto ou por coleta e entrega no endereço informado, sem balcão. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado."
      ]
    }
  ]
},
{
  "path": "/problemas/monitor-sem-sinal",
  "title": "Monitor Sem Sinal: Causas e Solução | Curitiba",
  "description": "Monitor mostra \"sem sinal\" com o computador ligado? Veja como separar cabo, entrada errada, placa de vídeo e falha do próprio monitor antes de gastar.",
  "h1": "Monitor sem sinal: cabo, entrada errada, placa de vídeo ou falha do monitor",
  "subtitulo": "A mensagem de sem sinal quase nunca diz onde está o defeito: ela apenas informa que nenhuma imagem chegou até a entrada selecionada.",
  "blocos": [
    {
      "titulo": "O que a mensagem realmente significa",
      "paragrafos": [
        "Sem sinal quer dizer que o monitor está vivo, acordou e não encontrou imagem na entrada que está selecionada. Isso elimina de imediato a hipótese de monitor morto e transfere a investigação para três pontos: o cabo, a saída de vídeo do computador e a entrada escolhida no menu do próprio monitor.",
        "A sequência correta é de testes cruzados: trocar o cabo, trocar a entrada, ligar o computador em outra tela e ligar o monitor em outro aparelho. Cada troca elimina uma variável, e a maioria dos casos termina aí, sem custo e sem peça."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Computador ligando com ventoinha girando e nenhuma imagem aponta para saída de vídeo, memória mal encaixada ou cabo em falha, não para o monitor. Imagem que some depois de alguns minutos sugere superaquecimento da placa de vídeo ou capacitor de fonte do monitor perdendo capacidade com o aquecimento.",
        "Quando a imagem só volta ao mexer no cabo, o problema é mecânico: conector frouxo, pino torto ou solda fria na entrada. Perder o vídeo logo após um upgrade ou limpeza costuma ser módulo de memória ou placa de vídeo mal assentados."
      ]
    },
    {
      "titulo": "Testes gratuitos antes de qualquer valor fechado",
      "paragrafos": [
        "Troque o cabo por outro em bom estado, percorra manualmente todas as entradas no menu do monitor, ligue o computador em uma TV pela porta HDMI e ligue o monitor em outro aparelho conhecido. Se o computador aparece na TV, o monitor é o suspeito; se não aparece em lugar nenhum, o problema está no computador.",
        "Em desktop com placa de vídeo dedicada, confirme se o cabo está na placa e não na saída da placa-mãe. Reassentar memória e placa de vídeo com o aparelho desligado da tomada resolve parte real dos casos após limpeza interna."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Quando o teste cruzado aponta para o monitor, o reparo é em nível de componente: fonte interna, placa lógica ou conector. Recusamos troca de painel, porque o custo se aproxima do valor de um monitor novo e informamos isso antes de qualquer serviço.",
        "Quando o teste aponta para o computador, o caminho é diagnóstico de vídeo em bancada, com reassentamento, teste com placa conhecida e verificação da saída integrada antes de indicar peça.",
        "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado."
      ]
    }
  ]
},
{
  "path": "/problemas/notebook-lento",
  "title": "Notebook Lento: Causas Reais e Solução | Curitiba",
  "description": "Notebook demorando para ligar, travando ao abrir programas ou lento só na bateria? Veja como separar disco mecânico, memória insuficiente, calor e software.",
  "h1": "Notebook lento: disco mecânico, memória curta, calor ou software acumulado",
  "subtitulo": "Lentidão tem quatro origens bem diferentes, e cada uma tem um custo próprio: identificar a sua evita gastar com peça, formatação ou aparelho novo.",
  "blocos": [
    {
      "titulo": "A lentidão nasce em um de quatro lugares",
      "paragrafos": [
        "Disco, memória, temperatura e software. Um notebook lento está limitado por um desses quatro pontos, e cada um deixa uma assinatura diferente no comportamento do aparelho. Confundir os quatro é o motivo de tanta gente pagar formatação e continuar com o mesmo problema no dia seguinte.",
        "A leitura do gerenciador de tarefas resolve boa parte da dúvida em dois minutos, sem custo: o recurso que fica em 100% enquanto os outros estão folgados é o gargalo real. Só depois disso faz sentido falar em peça, reinstalação ou limpeza interna."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Inicialização de vários minutos com disco em uso constante é a assinatura do HD mecânico, e nenhuma limpeza de software devolve velocidade nesse caso. Travar ao abrir a segunda ou terceira janela aponta para memória insuficiente.",
        "Perder desempenho depois de meia hora ligado é proteção térmica reduzindo a frequência do processador, por dissipador obstruído e pasta térmica ressecada. Ficar rápido na tomada e lento na bateria é plano de energia econômico ou bateria degradada."
      ]
    },
    {
      "titulo": "Testes que você pode fazer antes de acionar alguém",
      "paragrafos": [
        "Veja no gerenciador de tarefas qual recurso fica em 100%, confira se o disco do sistema tem menos de 10% livre, desative o que inicia junto com o sistema, remova extensões desconhecidas do navegador e compare o desempenho na tomada e na bateria.",
        "O que não recomendamos: instalar otimizadores e limpadores de registro, apagar arquivos de sistema para liberar espaço e continuar usando disco que faz estalos antes de salvar os dados."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Troca do disco mecânico por SSD com ajuste de memória resolve a maior parte dos casos e tem ganho imediato no tempo de inicialização. Quando a queda só aparece com o aparelho quente, o caminho é limpeza interna e troca de pasta térmica com teste de temperatura sob carga.",
        "Reinstalação limpa do sistema é indicada quando a causa é software acumulado, sempre com backup antes e restauração depois. Não vendemos formatação como solução de gargalo físico: se o limite for disco ou memória, dizemos isso antes.",
        "Atendimento remoto para casos de software e coleta e entrega no endereço informado para serviços de bancada, sem balcão. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao serviço executado."
      ]
    }
  ]
},
{
  "path": "/problemas/notebook-desligando-sozinho",
  "title": "Notebook Desligando Sozinho: Causas | Curitiba",
  "description": "Notebook desligando sozinho do nada, só em jogos ou quando tira da tomada? Veja como separar superaquecimento, bateria em fim de vida, carregador fraco e falha.",
  "h1": "Notebook desligando sozinho: temperatura, bateria, carregador ou placa",
  "subtitulo": "O momento em que o notebook desliga é o dado mais valioso do diagnóstico e separa problema térmico de bateria e de falha elétrica.",
  "blocos": [
    {
      "titulo": "O momento do desligamento resolve metade do caso",
      "paragrafos": [
        "Desligar sempre depois de alguns minutos aponta para temperatura. Desligar apenas fora da tomada aponta para bateria sem capacidade real. Desligar sem padrão nenhum aponta para carregador subdimensionado ou circuito de energia instável na placa.",
        "Essa separação evita o erro mais caro da categoria: trocar bateria em um aparelho que estava superaquecendo, ou pagar limpeza em um notebook cuja bateria já não sustenta carga."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Desligamento por tempo de uso é a assinatura da proteção térmica. Desligar só em jogos e programas pesados aponta para pasta térmica ressecada, dissipador obstruído ou carregador com potência abaixo da exigida.",
        "Estalo, cheiro de queimado ou aquecimento anormal no carregador exigem parar de usar imediatamente, porque insistir transforma reparo pontual em troca de placa."
      ]
    },
    {
      "titulo": "Verificações gratuitas antes de qualquer valor fechado",
      "paragrafos": [
        "Anote em que situação desliga, sinta o fluxo de ar na saída do dissipador, use o aparelho sobre superfície rígida por um dia, confira se o carregador tem a potência indicada na etiqueta e observe a temperatura sob carga.",
        "O que não recomendamos: soprar ar comprimido pelas grades, apoiar o notebook em base improvisada com o cooler bloqueado e continuar usando após cheiro de queimado."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Limpeza interna com troca de pasta térmica resolve a maior parte dos desligamentos por temperatura, e o resultado é verificável na medição sob carga depois do serviço. Desligamento fora da tomada exige medir a capacidade real da bateria antes de indicar troca.",
        "Conector de alimentação com mau contato e falha no circuito de energia são serviços de bancada com microssolda, sujeitos à viabilidade avaliada caso a caso.",
        "Atendimento apenas por coleta e entrega no endereço informado, sem balcão, com mínimo pré-aprovado de R$ 299,99 para serviços de bancada e garantia de 90 dias sobre mão de obra e peça aplicada."
      ]
    }
  ]
},
{
  "path": "/problemas/pen-drive-nao-reconhecido",
  "title": "Pen Drive Não Reconhecido: O Que Fazer | Curitiba",
  "description": "Pen drive não aparece no computador, pede formatação ou some do nada? Veja como separar porta USB, letra de unidade, tabela de partição corrompida e falha física.",
  "h1": "Pen drive não reconhecido: porta USB, partição corrompida ou falha física",
  "subtitulo": "A prioridade aqui não é o dispositivo, é o conteúdo: cada tentativa desnecessária consome parte da chance de recuperar os arquivos.",
  "blocos": [
    {
      "titulo": "A prioridade é o conteúdo, não o dispositivo",
      "paragrafos": [
        "Pen drive é mídia de custo baixo e vida útil limitada. Quando ele para de ser reconhecido, o valor em jogo está nos arquivos, e existem dois erros que encerram muitos casos antes do diagnóstico: aceitar a formatação sugerida pelo sistema e rodar utilitários automáticos de reparo.",
        "Ambos gravam na unidade e sobrescrevem justamente a estrutura que a recuperação usaria como mapa para localizar os dados."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Não aparecer em computador nenhum aponta para o próprio dispositivo: solda do conector, controlador ou memória. Aparecer em uma máquina e não em outra desloca a suspeita para porta USB, driver ou letra de unidade ocupada.",
        "Pedido de formatação significa tabela de partição ilegível, não arquivos apagados. Pasta vazia com espaço ocupado indica estrutura corrompida ou arquivos ocultos por praga digital."
      ]
    },
    {
      "titulo": "Verificações seguras antes de qualquer tentativa",
      "paragrafos": [
        "Teste em outro computador, troque de porta USB, verifique no gerenciamento de disco se a unidade aparece sem letra atribuída e exiba os itens ocultos antes de concluir que a pasta está vazia. Todos esses passos são de leitura e não gravam nada.",
        "O que não recomendamos: formatar, executar reparadores automáticos baixados por conta própria, abrir a carcaça com alicate e conectar repetidamente uma unidade que esquenta."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Com memória íntegra e problema de estrutura, a leitura é feita em bancada sobre imagem da mídia, sem escrita na unidade original. Conector solto por esforço mecânico é reparo de microssolda que costuma devolver a leitura normal.",
        "Não existe garantia de recuperação, e desconfie de quem promete. O que garantimos é o método e a informação da chance real antes de você aprovar a continuidade.",
        "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. O conteúdo recuperado é entregue em mídia nova e não é retido após a entrega."
      ]
    }
  ]
},
{
  "path": "/problemas/dobradica-do-notebook-quebrada",
  "title": "Dobradiça do Notebook Quebrada: Conserto | Curitiba",
  "description": "Dobradiça do notebook quebrada, carcaça estufando ou tampa que não para em pé? Veja como avaliar o dano na estrutura, o risco para o cabo de vídeo e o que realmente.",
  "h1": "Dobradiça do notebook quebrada: carcaça, cabo de vídeo e reparo estrutural",
  "subtitulo": "Dobradiça solta raramente fica igual: ela evolui para carcaça estufada, moldura descolando e cabo de vídeo pinçado.",
  "blocos": [
    {
      "titulo": "Dobradiça quebrada tem estágios, e eles custam diferente",
      "paragrafos": [
        "Quase nenhum notebook chega com a dobradiça rompida de uma vez. Primeiro a tampa deixa de parar no ângulo escolhido, depois a carcaça começa a estufar perto do encaixe, em seguida a moldura da tela descola de um lado e só então o conjunto cede por completo.",
        "O custo do reparo acompanha o estágio: corrigir a fixação enquanto o problema é estrutural é um serviço; esperar até o cabo de vídeo ser pinçado dentro do canal da dobradiça leva o valor para o conjunto da tela."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Tampa que não para no ângulo escolhido indica folga interna ou parafuso arrancado da base plástica. Carcaça estufando perto da dobradiça é o sinal clássico de bucha de fixação arrancada, com o plástico assumindo a carga.",
        "Tela que pisca ao movimentar a tampa aponta para cabo de vídeo pinçado, e moldura descolando mostra que o conjunto da tela já está sendo puxado pela estrutura."
      ]
    },
    {
      "titulo": "Verificações seguras antes de qualquer tentativa",
      "paragrafos": [
        "Pare de abrir e fechar o equipamento, observe se a carcaça está estufando, verifique se a tela pisca ao movimentar a tampa e confira se a moldura descolou em algum canto. Todos esses passos são de observação e não exigem abrir o notebook.",
        "O que não recomendamos: colar a carcaça, apertar parafusos com força em plástico já arrancado, forçar a tampa até o fim do curso e transportar o notebook aberto."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Com bucha arrancada, o reparo recompõe o ponto de fixação da carcaça e devolve firmeza à tampa. Eixo empenado ou mecanismo travado exige peça nova, e a disponibilidade para o modelo é confirmada antes da aprovação.",
        "Se o cabo de vídeo foi pinçado ou a tela trincou junto, o valor passa a incluir o conjunto da tela e não apenas a estrutura.",
        "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao serviço executado."
      ]
    }
  ]
},
{
  "path": "/problemas/tela-do-computador-piscando",
  "title": "Tela do Computador Piscando: O Que Fazer | Curitiba",
  "description": "Tela piscando, imagem tremendo ou monitor apagando por instantes? Veja como separar cabo, taxa de atualização, driver de vídeo, fonte do monitor e falha na placa.",
  "h1": "Tela do computador piscando: cabo, driver, monitor ou placa de vídeo",
  "subtitulo": "Piscar de imagem tem quatro origens possíveis, e três delas custam pouco para descartar.",
  "blocos": [
    {
      "titulo": "A ordem certa de investigar imagem piscando",
      "paragrafos": [
        "O divisor de águas é observar se o piscar acontece antes ou depois do sistema carregar. Piscar já na tela inicial da BIOS tira o sistema de suspeita e deixa cabo, monitor e saída de vídeo como candidatos.",
        "O segundo divisor é a carga: piscar que só aparece em jogo, edição de vídeo ou tela cheia aponta para calor e consumo, e não para software."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Tremor em faixas horizontais costuma ser cabo mal encaixado, adaptador sem blindagem ou conector com pino sujo. Apagões curtos indicam perda momentânea de sinal, comum em cabo rompido internamente ou fonte do monitor com capacitor cansado.",
        "Piscar que acompanha o movimento do cabo já isola o diagnóstico no cabo ou no conector. Em notebook, piscar conforme o ângulo da tampa aponta para cabo flat ou conector de tela."
      ]
    },
    {
      "titulo": "Verificações seguras antes de comprar qualquer peça",
      "paragrafos": [
        "Troque o cabo de vídeo por outro conhecido, ligue o monitor em outro computador, use outra saída de vídeo, reduza a taxa de atualização e tire o equipamento de filtros de linha compartilhados com motores. Nenhum passo exige abrir equipamento.",
        "O que não recomendamos: abrir o monitor por conta própria, porque a fonte interna guarda carga mesmo desligada da tomada, e comprar placa de vídeo antes de testar o cabo."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Piscar depois do sistema carregar se resolve reinstalando o driver correto do modelo e acertando resolução e taxa de atualização. Fonte interna com capacitor estufado e conector com mau contato são serviços de bancada.",
        "Painel de monitor trincado não é recuperado por nós, e isso é informado antes de retirar o equipamento.",
        "Atendimento sem balcão, com retirada e devolução no endereço informado em Curitiba e região. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      ]
    }
  ]
},
{
  "path": "/problemas/notebook-nao-conecta-no-wifi",
  "title": "Notebook Não Conecta no Wi-Fi: Como Resolver | Curitiba",
  "description": "Notebook não conecta no Wi-Fi, não encontra a rede ou conecta sem internet? Veja como separar driver, placa de rede desativada, antena solta e falha do roteador.",
  "h1": "Notebook não conecta no Wi-Fi: driver, adaptador, antena ou roteador",
  "subtitulo": "Antes de trocar placa ou comprar adaptador, descubra se a falha está no notebook ou na rede.",
  "blocos": [
    {
      "titulo": "A ordem certa de investigar conexão sem fio",
      "paragrafos": [
        "A primeira pergunta não é sobre o notebook, e sim sobre a rede: outros aparelhos conectam? Se todos falham, o trabalho é sobre roteador, cabeamento ou provedor, e mexer no notebook não muda nada.",
        "Confirmado que só o notebook falha, a segunda pergunta é se o adaptador aparece no sistema. Visível empurra a suspeita para perfil de rede, driver e economia de energia; ausente indica módulo desativado ou placa sem contato."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Lista de redes vazia aponta para adaptador desativado, driver ausente ou placa não reconhecida. Conexão estabelecida sem navegação indica DNS, conflito de endereço IP ou link do provedor fora do ar.",
        "Alcance muito curto é o sintoma clássico de antena interna desconectada, comum depois de manutenção anterior ou troca de tela, porque os cabos de antena passam pela dobradiça."
      ]
    },
    {
      "titulo": "Verificações seguras antes de trocar qualquer peça",
      "paragrafos": [
        "Confira se outro aparelho conecta na mesma rede, verifique modo avião e atalho de rede sem fio, esqueça a rede salva e conecte de novo, reinicie o roteador e teste o roteamento do celular. Nenhum passo exige abrir o notebook.",
        "O que não recomendamos: instalar programas que prometem turbinar o sinal, resetar o roteador sem a senha do provedor em mãos e abrir o notebook para reencaixar a placa sem experiência."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Driver, perfil de rede e economia de energia costumam ser resolvidos por atendimento remoto, sem retirar o equipamento. Antena desconectada, placa mal encaixada ou módulo em falha são serviços de bancada, com teste de alcance após o reparo.",
        "Quando o sinal falha em todos os aparelhos, o trabalho passa a ser sobre a rede: posicionamento, canal e cobertura.",
        "Atendimento sem balcão, com retirada e devolução no endereço informado em Curitiba e região. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      ]
    }
  ]
},
{
  "path": "/problemas/webcam-nao-funciona",
  "title": "Webcam Não Funciona: Causas e Solução | Curitiba",
  "description": "Webcam do notebook sem imagem, tela preta na reunião ou câmera não encontrada pelo sistema? Veja como separar permissão do sistema, driver, cabo flat e falha.",
  "h1": "Webcam não funciona: permissão, driver, cabo flat ou módulo",
  "subtitulo": "Tela preta na reunião raramente é câmera queimada.",
  "blocos": [
    {
      "titulo": "A ordem certa de investigar uma câmera sem imagem",
      "paragrafos": [
        "O primeiro divisor é gratuito: abrir o aplicativo de câmera nativo do sistema. Se a imagem aparece ali, o módulo está saudável e a falha está na permissão ou no programa usado nas reuniões.",
        "O segundo divisor é a estabilidade. Câmera que some e volta ao mexer na tampa aponta para cabo flat prensado na dobradiça; câmera que desapareceu da lista de dispositivos aponta para driver ou módulo em falha."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Imagem preta em todos os programas tira a suspeita do aplicativo e leva para permissão do sistema, driver ou hardware. Funcionar em um programa e falhar em outro é permissão por aplicativo ou outro software segurando a câmera aberta.",
        "Imagem esverdeada, tremida ou muito escura indica sensor ou conector com contato parcial, e isso é avaliação de bancada, não configuração."
      ]
    },
    {
      "titulo": "Verificações seguras antes de comprar câmera externa",
      "paragrafos": [
        "Confira obturador físico sobre a lente, teste o aplicativo de câmera nativo, revise as permissões do sistema, feche programas de vídeo concorrentes e reinicie uma vez. Em câmera externa, troque de porta USB e teste em outro computador.",
        "O que não recomendamos: instalar programas que prometem recuperar drivers automaticamente, forçar a moldura da tela para chegar ao módulo e desativar o antivírus inteiro para testar a câmera."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Permissão, driver e bloqueio de antivírus são corrigidos por atendimento remoto, sem retirar o equipamento. Cabo flat rompido e módulo em falha exigem abertura da moldura em bancada, com teste de imagem antes da devolução.",
        "Atendimento sem balcão, com retirada e devolução no endereço informado em Curitiba e região. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      ]
    }
  ]
},
  {
    "path": "/problemas",
    "title": "Problemas de Computador, Notebook e TV | Curitiba",
    "description": "Índice de sintomas atendidos em Curitiba: computador lento, tela azul, Wi-Fi caindo, notebook que não liga e smart TV com defeito.",
    "h1": "Problemas atendidos: encontre o seu sintoma antes de gastar",
    "subtitulo": "Páginas de sintoma escritas a partir dos atendimentos reais da bancada.",
    "blocos": [
      {
        "titulo": "Como usar este índice de problemas",
        "paragrafos": [
          "A maioria dos reparos errados começa com uma suspeita, não com um sintoma. Quem chega dizendo que acha que é a placa costuma pagar por uma peça que não era o problema. Por isso este índice está organizado pelo que o equipamento faz — não liga, liga sem imagem, trava, esquenta, perde rede — e não pelo componente que alguém imaginou estar em falha.",
          "Cada página segue a mesma lógica da bancada: primeiro os testes gratuitos que separam grandes grupos de causa, depois as verificações seguras que podem ser feitas em casa e só então as intervenções que exigem ferramenta e equipamento de medição."
        ]
      },
      {
        "titulo": "Sintomas agrupados por equipamento",
        "paragrafos": [
          "Notebook concentra energia, tela, teclado e refrigeração no mesmo corpo, então sintomas parecidos têm origens diferentes. No computador de mesa as peças são independentes, o que permite isolar fonte, memória, vídeo e armazenamento por partes.",
          "Televisão quase nunca quebra inteira: falha uma etapa da cadeia entre fonte, placa principal, backlight e painel. Em rede, se só um aparelho sofre o suspeito é o aparelho; se todos sofrem, o suspeito é a cobertura."
        ]
      },
      {
        "titulo": "Meu sintoma não está na lista",
        "paragrafos": [
          "O índice cobre os sintomas mais frequentes, mas a bancada recebe casos fora do padrão toda semana: placa com corrosão após infiltração, equipamento que só falha em um horário do dia, TV que funciona por cabo e não por streaming.",
          "Descrever o comportamento em duas frases já é suficiente para dizermos se é caso de ajuste remoto, visita ou bancada. Informe desde quando começou, se houve queda de energia ou líquido e o que já foi tentado."
        ]
      },
      {
        "titulo": "Como funciona o atendimento e o custo",
        "paragrafos": [
          "Atendimento sem balcão, com retirada e devolução no endereço informado em Curitiba e região. A visita técnica inicial é sem compromisso e a coleta é gratuita nos serviços acima de uma hora de bancada.",
          "Para procedimentos de bancada existe mínimo pré-aprovado de R$ 299,99, informado antes da execução. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
        ]
      }
    ],
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
  },
{
  "path": "/problemas/tv-nao-conecta-no-wifi",
  "title": "TV Não Conecta no Wi-Fi: O Que Fazer | Curitiba",
  "description": "Smart TV não conecta no Wi-Fi, some da lista de redes ou cai no meio do filme? Veja como separar cobertura do roteador, faixa de 5 GHz, sistema da TV e módulo.",
  "h1": "TV não conecta no Wi-Fi: cobertura, faixa, sistema ou módulo",
  "subtitulo": "Três testes gratuitos separam problema de rede de falha do aparelho.",
  "blocos": [
    {
      "titulo": "A ordem certa de investigar uma TV sem conexão",
      "paragrafos": [
        "A primeira pergunta é se outros aparelhos conectam bem no mesmo cômodo. Se conectam, o roteador entrega sinal ali e a investigação passa para a televisão; se todos sofrem, o assunto é cobertura da rede.",
        "A segunda pergunta é se a TV enxerga a rede na lista. Rede visível com erro de senha é perfil salvo desatualizado; lista vazia com redes vizinhas aparecendo aponta para faixa incompatível ou módulo em falha."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Conectar e cair depois de alguns minutos indica sinal no limite, canal congestionado ou economia de energia desligando o rádio. Enxergar apenas a rede de 2,4 GHz não é defeito: muitos modelos não suportam 5 GHz.",
        "Conectar e não abrir aplicativos costuma ser data, hora ou DNS da televisão, e não falta de internet."
      ]
    },
    {
      "titulo": "Verificações seguras antes de trocar o aparelho",
      "paragrafos": [
        "Compare com outros aparelhos no mesmo cômodo, reinicie o roteador, esqueça e reconecte a rede na TV, teste a faixa de 2,4 GHz, confira data e hora e use o cabo de rede quando houver entrada. Funcionando por cabo, o defeito está no módulo sem fio.",
        "O que não recomendamos: restaurar a televisão de fábrica como primeira tentativa, instalar atualização baixada de site não oficial e trocar o roteador antes de medir a cobertura no cômodo."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Cobertura fraca é trabalho de rede: posicionamento, canal e reforço de sinal, sem mexer no aparelho. Data, hora, DNS e perfil de rede inconsistente são ajustes de configuração. Módulo sem fio em falha é serviço de bancada com avaliação da placa principal.",
        "Quando um dispositivo externo de streaming custa menos que o reparo da placa, informamos isso antes da coleta.",
        "Atendimento sem balcão, com retirada e devolução no endereço informado em Curitiba e região. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      ]
    }
  ]
},
{
  "path": "/problemas/windows-nao-inicia",
  "title": "Windows Não Inicia: Como Recuperar o Sistema | Curitiba",
  "description": "Windows travado no logo, reparo automático em loop ou mensagem de disco de inicialização não encontrado? Veja como separar falha de sistema, disco com setor ruim.",
  "h1": "Windows não inicia: sistema, disco ou configuração de boot",
  "subtitulo": "Computador que liga mas não carrega o sistema quase nunca precisa de formatação imediata.",
  "blocos": [
    {
      "titulo": "A ordem certa de investigar um sistema que não carrega",
      "paragrafos": [
        "A primeira pergunta é se o equipamento chega a exibir a marca do fabricante. Se chega, alimentação, memória e vídeo já responderam, e a falha está no caminho entre o firmware e o sistema operacional.",
        "A segunda pergunta é se o erro é sempre igual. Falha idêntica em toda tentativa aponta para arquivo de sistema ou setor específico do disco; falha que muda de lugar aponta para memória ou alimentação instável."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Travar no logo com a bolinha girando costuma ser driver corrompido, atualização interrompida ou disco com leitura lenta na área do sistema. Reparo automático em loop indica arquivos de boot inconsistentes ou disco respondendo com erro intermitente.",
        "Mensagem de dispositivo de boot não encontrado significa que o sistema nem chegou a ser lido: ou a ordem de inicialização mudou na BIOS ou o disco não está sendo reconhecido."
      ]
    },
    {
      "titulo": "Verificações seguras antes de reinstalar qualquer sistema",
      "paragrafos": [
        "Retire pen drives e discos externos antes de ligar, observe se aparece a marca do fabricante, fotografe a mensagem exata de erro e desligue da tomada por alguns minutos para descartar travamento de firmware. Nenhum passo apaga dados.",
        "O que não recomendamos: reinstalar o Windows antes de conhecer a saúde do disco, usar programas de reparo de origem desconhecida e insistir em reiniciar um equipamento que já faz ruído de clique."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Com disco saudável, o reparo do carregador e a correção dos arquivos de boot devolvem o sistema sem formatar. Com erro de leitura, a prioridade muda: primeiro a cópia dos dados, depois a discussão sobre reparo ou troca por SSD.",
        "Disco com dano físico severo exige sala limpa, procedimento que não executamos, e isso é informado antes de retirar o equipamento.",
        "Atendimento sem balcão, com retirada e devolução no endereço informado em Curitiba e região. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      ]
    }
  ]
},
{
  "path": "/problemas/tv-com-imagem-escura",
  "title": "TV com Imagem Escura: Causas e Conserto | Curitiba",
  "description": "TV com imagem escura, som normal e tela quase apagada? Veja como separar backlight queimado, placa de fonte, ajuste de brilho e falha do painel antes de trocar.",
  "h1": "TV com imagem escura: iluminação de fundo, fonte ou ajuste",
  "subtitulo": "Tela escura com som normal quase nunca é painel queimado.",
  "blocos": [
    {
      "titulo": "A ordem certa de investigar uma tela escura",
      "paragrafos": [
        "O primeiro teste é gratuito e leva segundos: no escuro, aponte uma lanterna para a tela com o aparelho ligado. Se a imagem aparece fraca mas se move, o painel está funcionando e a iluminação de fundo é a suspeita principal.",
        "O segundo passo é descartar configuração. Modo economia de energia, sensor de luz ambiente e perfis herdados de modo loja escurecem a tela sem qualquer defeito, e restaurar o padrão de fábrica elimina essa hipótese."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Som normal com imagem quase invisível reforça a suspeita de iluminação. Escurecimento em faixa ou em uma lateral indica trecho da iluminação apagado, e não a tela inteira em falha.",
        "Quando a TV começa normal e escurece depois de aquecer, a suspeita recai sobre a placa de fonte ou o driver de iluminação, e isso só se confirma medindo tensão com o aparelho já quente."
      ]
    },
    {
      "titulo": "Verificações seguras antes de trocar o aparelho",
      "paragrafos": [
        "Faça o teste da lanterna no escuro, confira se o som continua normal, revise brilho, contraste e sensor de luz ambiente, restaure o perfil de fábrica e teste outra entrada HDMI com outro cabo. Nenhum passo exige abrir o televisor.",
        "O que não recomendamos: abrir o televisor por conta própria, porque a placa de fonte guarda carga elevada mesmo desligada, e comprar peça anunciada como universal antes da avaliação do modelo."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Substituição das barras de iluminação e revisão do conjunto óptico é serviço de bancada, com teste de uniformidade antes da devolução. Capacitor estufado e driver em proteção exigem medição de tensão e relatório do que foi trocado.",
        "Painel de televisor trincado ou com falha interna não é recuperado por nós, e isso é informado antes de retirar o aparelho.",
        "Atendimento sem balcão, com retirada e devolução no endereço informado em Curitiba e região. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      ]
    }
  ]
},
{
  "path": "/problemas/tv-travando",
  "title": "TV Travando ou Muito Lenta: O Que Fazer | Curitiba",
  "description": "Smart TV travando, aplicativo congelando ou controle demorando para responder? Veja como separar memória cheia, aplicativo desatualizado, rede saturada e falha.",
  "h1": "TV travando: memória cheia, aplicativo, rede ou placa",
  "subtitulo": "Três das quatro causas de smart TV lenta custam pouco para descartar antes de aposentar o aparelho.",
  "blocos": [
    {
      "titulo": "A ordem certa de investigar TV lenta",
      "paragrafos": [
        "O primeiro teste não exige ferramenta: ligue um conteúdo por HDMI. Se a imagem roda sem engasgo, painel e processamento de vídeo estão saudáveis, e a investigação passa a ser sobre sistema e rede.",
        "O segundo divisor é o momento do travamento. Travar já na tela inicial aponta para memória e sistema; travar apenas dentro de aplicativos de streaming aponta para rede, buffer ou versão do app."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Demora de minutos para responder indica armazenamento interno lotado ou atualização mal concluída. Vídeo que congela com o som seguindo aponta para decodificação e rede instável.",
        "Reinício ao abrir aplicativo pesado é o padrão clássico de fonte com capacitor cansado: no pico de consumo a tensão cai e a placa reinicia."
      ]
    },
    {
      "titulo": "Verificações seguras antes de trocar a televisão",
      "paragrafos": [
        "Teste conteúdo por HDMI, meça o sinal de Wi-Fi no ponto exato da TV, limpe o cache do aplicativo que trava, desligue a TV da tomada por dois minutos e libere espaço removendo apps sem uso. Nenhum passo exige abrir o aparelho.",
        "O que não recomendamos: abrir a traseira da televisão por conta própria, porque a fonte guarda carga mesmo desligada da tomada, e instalar firmware baixado de site não oficial."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Travamento por espaço, cache ou atualização incompleta é correção de configuração, sem troca de peça. Sinal fraco no cômodo é trabalho de cobertura e canal de rede, não de televisão.",
        "Reinício sob carga e travamento térmico levam o caso para bancada, com teste sob carga real depois do reparo. Painel de TV trincado não é recuperado por nós, e isso é informado antes da retirada.",
        "Atendimento sem balcão, com retirada e devolução no endereço informado em Curitiba e região. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      ]
    }
  ]
},
{
  "path": "/problemas/mouse-nao-funciona",
  "title": "Mouse Não Funciona: Como Resolver | Curitiba",
  "description": "Mouse não funciona, cursor travado ou clique falhando sozinho? Veja como separar porta USB, receptor sem fio, driver, bateria e falha do próprio mouse.",
  "h1": "Mouse não funciona: porta USB, receptor, driver ou o próprio mouse",
  "subtitulo": "Um teste de um minuto separa defeito do periférico de falha da porta USB ou do sistema.",
  "blocos": [
    {
      "titulo": "A ordem certa de investigar um mouse parado",
      "paragrafos": [
        "O teste que decide tudo é gratuito: levar o mouse para outro computador. Funcionando lá, o periférico está bom e a investigação passa para porta USB, energia e sistema.",
        "O segundo divisor é a quantidade de dispositivos afetados. Só o mouse aponta para o próprio aparelho ou para uma porta específica; mouse e teclado juntos apontam para a controladora USB ou para drivers substituídos em atualização."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Clique que dispara duas vezes sozinho é desgaste do micro switch, típico de uso intenso, e não tem relação com vírus ou configuração. Cursor que trava por segundos aponta para pilha fraca, receptor mal posicionado ou superfície inadequada para o sensor.",
        "Periférico que some ao acordar da suspensão é efeito da economia de energia desligando a porta USB, o que é configuração do sistema e não peça."
      ]
    },
    {
      "titulo": "Verificações seguras antes de comprar outro mouse",
      "paragrafos": [
        "Teste o mouse em outra máquina, troque de porta USB preferindo as traseiras, troque a pilha em modelos sem fio, aproxime o receptor, limpe o sensor e teste sobre superfície fosca. Nenhum passo exige abrir equipamento.",
        "O que não recomendamos: instalar programas que prometem consertar drivers automaticamente, forçar o conector em porta com folga e abrir o mouse para mexer no switch sem experiência."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Política de energia, driver e configuração de entrada costumam ser resolvidos por atendimento remoto. Porta frontal solta, conector torto ou controladora com falha parcial são serviços de bancada, com teste em todas as portas depois do reparo.",
        "Quando o custo do reparo supera o valor de um periférico novo, dizemos isso abertamente em vez de empurrar serviço.",
        "Atendimento sem balcão, com retirada e devolução no endereço informado em Curitiba e região. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      ]
    }
  ]
},
{
  "path": "/problemas/computador-sem-som",
  "title": "Computador Sem Som: Como Resolver | Curitiba",
  "description": "Computador sem som, som só no fone ou saída de áudio sumida do Windows? Veja como separar dispositivo de saída errado, driver, conector danificado e falha no chip.",
  "h1": "Computador sem som: saída errada, driver, conector ou chip de áudio",
  "subtitulo": "A maior parte dos computadores sem áudio não tem peça queimada: o que falta é investigar na ordem certa.",
  "blocos": [
    {
      "titulo": "A ordem certa de investigar áudio",
      "paragrafos": [
        "Falta de som é o sintoma em que mais se troca peça sem necessidade. A investigação correta segue quatro camadas: saída selecionada, mixer por aplicativo, driver do sistema e só então hardware.",
        "Monitores conectados por HDMI aparecem como dispositivo de áudio mesmo sem alto-falante. O sistema passa a enviar o som para lá e o usuário conclui que a placa queimou, quando nada quebrou."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Nenhum som em nenhum programa aponta para dispositivo de saída errado, serviço de áudio parado ou driver ausente. Som só no fone indica conector oxidado ou fone fixado como padrão pelo sistema.",
        "Saída sumida da lista do Windows aparece quando o driver foi removido ou quando o chip de áudio deixou de responder. Chiado e picotes entram em conflito de driver, interferência elétrica ou cabo sem blindagem."
      ]
    },
    {
      "titulo": "Verificações seguras antes de trocar qualquer peça",
      "paragrafos": [
        "Confira o dispositivo de saída, abra o mixer de volume, teste um fone conhecido nas saídas frontal e traseira, teste a caixa em outro equipamento e verifique o gerenciador de dispositivos. Nenhum passo exige abrir o gabinete.",
        "O que não recomendamos: instalar pacotes automáticos de driver baixados de sites genéricos, comprar caixa de som antes de testar a saída e forçar o plugue em jack com folga."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Quando o hardware responde, a solução é reinstalar o driver adequado ao modelo e restaurar as saídas padrão. Jack solto, oxidado ou desconectado da placa-mãe é serviço de bancada.",
        "Boa parte dos casos de áudio se resolve por atendimento remoto, sem retirar o equipamento, e é isso que indicamos quando cabe.",
        "Atendimento sem balcão, com retirada e devolução no endereço informado. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao serviço executado."
      ]
    }
  ]
},
{
  "path": "/problemas/computador-travando",
  "title": "Computador Travando: Causas e Conserto | Curitiba",
  "description": "Computador travando do nada, congelando a tela ou parando só em jogos e programas pesados? Veja como separar memória com defeito, superaquecimento, disco em falha.",
  "h1": "Computador travando: memória, temperatura, disco em falha ou software",
  "subtitulo": "O momento em que o travamento acontece diz mais do que qualquer teste isolado e separa peça defeituosa de problema de sistema.",
  "blocos": [
    {
      "titulo": "O momento do travamento é o melhor indício",
      "paragrafos": [
        "Um computador que congela não dá mensagem, mas dá contexto. Travar em repouso, travar sob carga e travar sempre no mesmo programa são três problemas diferentes com causas diferentes, e registrar em que situação acontece reduz o campo de investigação antes de qualquer teste técnico.",
        "Travamento total, sem mouse e sem teclado, coloca memória, temperatura e fonte na frente da fila. Travamento curto e repetido aponta para disco com setores em falha. Travamento com hora marcada, em um programa específico, costuma ser software puro."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Tela congelada que só volta reiniciando no botão sugere memória com defeito, superaquecimento do processador ou fonte instável sob carga. Pausas curtas e repetidas são a assinatura de disco em falha esperando releitura de setores.",
        "Travar apenas em jogos e programas pesados aponta para temperatura, fonte subdimensionada ou driver de vídeo. Congelar sempre no mesmo programa indica instalação corrompida ou conflito de software, não peça queimada."
      ]
    },
    {
      "titulo": "Verificações antes de comprar qualquer peça",
      "paragrafos": [
        "Anote em que situação trava, observe no gerenciador de tarefas se algum recurso vai a 100% antes do congelamento, confira o espaço livre do disco, rode o diagnóstico de memória do próprio Windows e verifique a temperatura sob carga.",
        "O que não recomendamos: trocar memória por tentativa, instalar otimizadores e continuar usando um disco que faz estalos antes de salvar os arquivos."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Travamento total pede diagnóstico em bancada com teste cruzado de memória e verificação de tensões da fonte. Travamento ligado ao calor resolve com limpeza interna, troca de pasta térmica e teste de temperatura sob carga depois do serviço.",
        "Disco com setores em falha não se conserta: o caminho é preservar os dados enquanto há leitura e migrar o sistema para uma unidade saudável. Quando a origem é software, a reinstalação limpa é feita com backup antes e restauração depois.",
        "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao serviço executado."
      ]
    }
  ]
},
{
  "path": "/problemas/touchpad-nao-funciona",
  "title": "Touchpad Não Funciona no Notebook | Curitiba",
  "description": "Touchpad do notebook parou de responder, funciona pela metade ou só o clique falhou? Veja como separar atalho desativado, driver, cabo flat solto e falha física.",
  "h1": "Touchpad não funciona: atalho desativado, driver, cabo flat ou falha física",
  "subtitulo": "Boa parte dos touchpads que aparentam estar queimados está apenas desativada por atalho de teclado ou driver trocado em atualização.",
  "blocos": [
    {
      "titulo": "O touchpad falha em três camadas",
      "paragrafos": [
        "Configuração, driver e hardware. A camada de configuração é a mais comum e a mais barata: um atalho de teclado pressionado sem querer desativa a peça inteira. A camada de driver aparece depois de atualizações do sistema, e só a terceira camada envolve abrir o aparelho.",
        "Testar um mouse USB divide o problema ao meio em segundos: se o mouse funciona normalmente, o sistema está saudável e a investigação fica restrita ao touchpad."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Ausência total de resposta costuma ser atalho de função ou driver removido. Cursor que move com clique morto indica microswitch desgastado ou toque para clicar desativado nas configurações.",
        "Área morta em parte da superfície aponta para trilha rompida na placa do touchpad, e cursor que pula ou clica sozinho sugere resíduo, umidade ou cabo flat mal encaixado."
      ]
    },
    {
      "titulo": "Testes gratuitos antes de qualquer valor fechado",
      "paragrafos": [
        "Pressione a tecla de função com o ícone de touchpad, desconecte o mouse externo e reinicie, confirme nas configurações se o dispositivo está habilitado e reinstale o driver oficial do fabricante do notebook em vez do driver genérico.",
        "O que não recomendamos: abrir o notebook com espátula improvisada, aplicar produto de limpeza direto sobre a superfície e insistir no uso depois de contato com líquido, porque a corrosão avança com o aparelho energizado."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "Atalho, configuração e driver cobrem a maior parte dos chamados e podem ser resolvidos por acesso remoto, sem retirar o notebook do endereço. Touchpad que sumiu após queda costuma ser cabo flat solto, corrigido em bancada sem troca de peça.",
        "Área morta e clique arrebentado exigem substituição do módulo, condicionada à disponibilidade da peça para o modelo. Sem peça compatível, informamos e devolvemos o aparelho em vez de adaptar componente de outro modelo.",
        "Atendimento remoto ou por coleta e entrega no endereço informado, sem balcão. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao serviço executado."
      ]
    }
  ]
},
{
  "path": "/problemas/tv-desligando-sozinha",
  "title": "TV Desligando Sozinha: Causas e Conserto | Curitiba",
  "description": "Televisor que desliga sozinho, reinicia ou entra em ciclo de LED piscando? Entenda como separar capacitor de fonte, proteção térmica, ajuste de economia e placa.",
  "h1": "TV desligando sozinha: proteção da fonte, ajuste do menu ou falha de placa",
  "subtitulo": "Televisor que apaga sem comando quase nunca é defeito aleatório: na maioria dos casos é o próprio aparelho se protegendo de uma tensão fora da faixa.",
  "blocos": [
    {
      "titulo": "A TV não falha sozinha: ela se protege",
      "paragrafos": [
        "Todo televisor moderno monitora as próprias tensões. Quando um valor sai da faixa aceitável, o circuito de proteção corta a alimentação para evitar dano maior. Por isso o desligamento repentino costuma ser sintoma de fonte comprometida, e não de falha de software.",
        "Antes de falar em reparo, três verificações eliminam boa parte dos chamados: temporizador ativado no menu, modo de economia por ausência de sinal e aparelho conectado com defeito derrubando a TV. São gratuitas e levam poucos minutos."
      ]
    },
    {
      "titulo": "Sintomas e o que cada um costuma indicar",
      "paragrafos": [
        "Desligar depois de alguns minutos ligada é o padrão clássico de componente da fonte que perde característica ao aquecer. Ciclo de desliga e liga indica proteção atuando a cada tentativa de partida.",
        "Desligamento sempre no mesmo intervalo aponta para temporizador ou modo de economia. Queda em cenas claras ou com volume alto indica fonte incapaz de sustentar pico de consumo. Se o som continua e só a imagem some, o quadro é de iluminação da tela, não de desligamento."
      ]
    },
    {
      "titulo": "Verificações antes de acionar alguém",
      "paragrafos": [
        "Desative temporizador e modo de economia no menu, desconecte todos os aparelhos externos, ligue a TV direto na tomada sem extensão, anote o intervalo até o desligamento e observe o padrão do LED depois de apagar.",
        "O que não recomendamos: abrir a traseira do televisor, tentar descarregar componentes da fonte, religar em sequência após estalo e transportar o aparelho sem proteção rígida nas bordas."
      ]
    },
    {
      "titulo": "O que resolve cada cenário e quais são as condições",
      "paragrafos": [
        "A avaliação mede as tensões da placa de alimentação sob carga, com o aparelho já aquecido, porque falha térmica não aparece em teste rápido. Capacitor degradado e solda fadigada são tratados em nível de componente, com teste prolongado de estabilidade antes da devolução.",
        "Quando o custo se aproxima do valor de um televisor equivalente, ou a peça não existe mais para o modelo, orientamos não fazer o serviço. Não trocamos painel de televisor.",
        "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado; descarga elétrica posterior é dano novo."
      ]
    }
  ]
},
{
    "path": "/problemas/computador-fazendo-barulho",
    "title": "Computador Fazendo Barulho: Como Identificar a Origem | Curitiba",
    "description": "PC barulhento, ventoinha rugindo, estalo ou zumbido? Entenda como separar cooler, fonte, disco r\u00edgido e ru\u00eddo el\u00e9trico antes de trocar pe\u00e7a, e como funciona.",
    "h1": "Computador fazendo barulho: como descobrir a origem antes de trocar pe\u00e7a",
    "subtitulo": "Rugido por temperatura, chiado de rolamento, clique de disco e zumbido el\u00e9trico t\u00eam causas, urg\u00eancias e custos diferentes \u2014 e comprar cooler novo antes do diagn\u00f3stico \u00e9 o erro mais caro.",
    "blocos": [
      {
        "titulo": "Cada tipo de ru\u00eddo aponta para um lugar diferente",
        "paragrafos": [
          "Ru\u00eddo de ar em volume alto \u00e9 refrigera\u00e7\u00e3o respondendo a calor. Ru\u00eddo met\u00e1lico \u00e9 pe\u00e7a mec\u00e2nica gasta. Ru\u00eddo ritmado vem do armazenamento. Ru\u00eddo que acompanha a carga el\u00e9trica \u00e9 bobina. S\u00e3o quatro fam\u00edlias com desfechos que n\u00e3o se parecem.",
          "Trocar a ventoinha de um computador com dissipador entupido devolve sil\u00eancio por poucos dias, porque a temperatura continua alta. E trocar pe\u00e7a quando o ru\u00eddo vinha do disco desperdi\u00e7a as horas em que os arquivos ainda poderiam ser copiados."
        ]
      },
      {
        "titulo": "Sintomas e o que cada um costuma indicar",
        "paragrafos": [
          "Ru\u00eddo constante que aumenta com o uso \u00e9 temperatura. Chiado met\u00e1lico intermitente \u00e9 rolamento em fim de vida. Clique ritmado \u00e9 disco r\u00edgido com falha de cabe\u00e7a, e nesse caso o barulho significa urg\u00eancia.",
          "Zumbido grave sob carga \u00e9 ru\u00eddo el\u00e9trico em bobina. Batida seca costuma ser cabo encostando na h\u00e9lice. Estalo com cheiro de queimado \u00e9 o \u00fanico item da lista que pede desligar imediatamente."
        ]
      },
      {
        "titulo": "Verifica\u00e7\u00f5es antes de comprar qualquer pe\u00e7a",
        "paragrafos": [
          "Identifique de onde vem o som com o gabinete aberto, observe se o ru\u00eddo acompanha a carga, confira se o equipamento est\u00e1 em superf\u00edcie r\u00edgida com folga atr\u00e1s e grave um \u00e1udio curto para a triagem.",
          "O que n\u00e3o recomendamos: lubrificar rolamento com \u00f3leo dom\u00e9stico, aspirar diretamente sobre a placa, travar a h\u00e9lice com o dedo e continuar ligando ap\u00f3s estalo com cheiro de queimado."
        ]
      },
      {
        "titulo": "O que resolve cada cen\u00e1rio e quais s\u00e3o as condi\u00e7\u00f5es",
        "paragrafos": [
          "Limpeza t\u00e9cnica com troca de pasta t\u00e9rmica resolve a maior parte dos casos de ru\u00eddo por temperatura, sem substituir pe\u00e7a. Rolamento gasto exige troca de ventoinha por modelo de mesmo encaixe e vaz\u00e3o, com teste sob carga antes de fechar.",
          "Fonte barulhenta \u00e9 medida sob carga: tens\u00e3o fora da faixa transforma a troca em prote\u00e7\u00e3o do restante do hardware. Ru\u00eddo mec\u00e2nico no disco muda a prioridade para preservar os arquivos, com trabalho sobre c\u00f3pia.",
          "Atendimento apenas por coleta e entrega no endere\u00e7o informado, sem balc\u00e3o. Nenhuma pe\u00e7a \u00e9 trocada sem sua aprova\u00e7\u00e3o. Garantia de 90 dias sobre m\u00e3o de obra e pe\u00e7a aplicada, limitada ao bloco reparado."
        ]
      }
    ]
  },

{
    "path": "/problemas/tv-com-linhas-na-tela",
    "title": "TV com Linhas na Tela: Tem Conserto? | Curitiba",
    "description": "Televisor com linhas verticais, horizontais ou faixas coloridas na imagem? Entenda quando \u00e9 conex\u00e3o do painel, placa de controle ou dano interno sem reparo vi\u00e1vel.",
    "h1": "TV com linhas na tela: quando \u00e9 conex\u00e3o, quando \u00e9 placa e quando n\u00e3o tem reparo",
    "subtitulo": "Linha vertical, linha horizontal e faixa escura parecem o mesmo defeito, mas v\u00e3o de um reparo simples de contato at\u00e9 a aus\u00eancia de solu\u00e7\u00e3o vi\u00e1vel.",
    "blocos": [
      {
        "titulo": "Tr\u00eas origens poss\u00edveis, com desfechos muito diferentes",
        "paragrafos": [
          "A primeira \u00e9 a conex\u00e3o entre a placa de controle da imagem e o painel, causa comum depois de transporte e a de reparo mais simples. A segunda \u00e9 a pr\u00f3pria placa de controle, com solda fadigada ou circuito comprometido, repar\u00e1vel em n\u00edvel de componente.",
          "A terceira \u00e9 o painel. Com a matriz danificada por impacto ou falha interna n\u00e3o existe reparo vi\u00e1vel, e n\u00e3o trabalhamos com substitui\u00e7\u00e3o de painel de televisor. Declaramos essa limita\u00e7\u00e3o antes de recolher o aparelho."
        ]
      },
      {
        "titulo": "Sintomas e o que cada um costuma indicar",
        "paragrafos": [
          "Linhas verticais coloridas e fixas costumam vir do comando das colunas ou da conex\u00e3o do painel. Linhas horizontais apontam para o lado das linhas do painel, com a menor taxa de reparo vi\u00e1vel. Faixa larga escura aparece com frequ\u00eancia ap\u00f3s transporte.",
          "Linhas que mudam conforme a temperatura indicam solda fadigada, cen\u00e1rio frequentemente repar\u00e1vel. Linhas que s\u00f3 aparecem em uma entrada sugerem problema no cabo ou no aparelho conectado, n\u00e3o no televisor."
        ]
      },
      {
        "titulo": "Testes que voc\u00ea pode fazer antes de acionar algu\u00e9m",
        "paragrafos": [
          "Troque de entrada e de aparelho conectado, abra o menu interno da TV para ver se as linhas aparecem sobre ele, fotografe a tela com o menu aberto e observe se o defeito muda com o tempo ligado.",
          "O que n\u00e3o recomendamos: pressionar a tela, aquecer a moldura com secador, apoiar o televisor sobre a face de v\u00eddeo e transportar o aparelho sem prote\u00e7\u00e3o r\u00edgida nas bordas."
        ]
      },
      {
        "titulo": "O que resolve cada cen\u00e1rio e quais s\u00e3o as condi\u00e7\u00f5es",
        "paragrafos": [
          "A avalia\u00e7\u00e3o come\u00e7a pela inspe\u00e7\u00e3o de conectores, cabo flat e placa de controle. Parte real dos casos termina em reconex\u00e3o ou reparo de solda. Circuito comprometido segue para reparo com esta\u00e7\u00e3o de retrabalho e teste prolongado de imagem antes da devolu\u00e7\u00e3o.",
          "Identificado dano de painel, informamos e devolvemos o aparelho sem cobrar tentativa de reparo. Quando o custo se aproxima do valor de um televisor equivalente, orientamos n\u00e3o fazer o servi\u00e7o.",
          "Atendimento apenas por coleta e entrega no endere\u00e7o informado, sem balc\u00e3o. Garantia de 90 dias sobre m\u00e3o de obra e pe\u00e7a aplicada, limitada ao bloco reparado; impacto posterior \u00e9 dano novo e n\u00e3o est\u00e1 coberto."
        ]
      }
    ]
  },

  {
    "path": "/problemas/computador-nao-liga",
    "title": "Computador de Mesa N\u00e3o Liga: Diagn\u00f3stico Real | Curitiba",
    "description": "PC n\u00e3o liga, n\u00e3o d\u00e1 v\u00eddeo ou liga e apaga em seguida? Entenda como separar fonte, bot\u00e3o, placa-m\u00e3e e mem\u00f3ria antes de trocar pe\u00e7a por achismo, e como funciona.",
    "h1": "Computador de mesa n\u00e3o liga: como descobrir a causa sem trocar pe\u00e7a por achismo",
    "subtitulo": "\"N\u00e3o liga\" descreve pelo menos quatro defeitos diferentes, com custos que v\u00e3o de um cabo trocado a reparo de placa \u2014 e a ordem do teste \u00e9 o que evita comprar pe\u00e7a antes do diagn\u00f3stico.",
    "blocos": [
      {
        "titulo": "Quatro defeitos diferentes com o mesmo nome",
        "paragrafos": [
          "O aparelho pode estar sem energia nenhuma, pode ligar e cortar em seguida, pode ligar sem completar o POST ou pode completar o POST sem enviar imagem ao monitor. S\u00e3o quatro estados distintos, com causas e custos que n\u00e3o se parecem.",
          "Em bancada o caminho vai do mais barato ao mais complexo: energia da tomada, cabo, fonte, bot\u00e3o, depois montagem m\u00ednima fora do gabinete e s\u00f3 ent\u00e3o placa. O pr\u00f3prio gabinete \u00e9 uma fonte comum de curto, com espa\u00e7adores mal posicionados e cabos frontais em contato."
        ]
      },
      {
        "titulo": "Sintomas e o que cada um costuma indicar",
        "paragrafos": [
          "Nada acontecer ao apertar o bot\u00e3o aponta cabo, filtro de linha, fonte ou bot\u00e3o do gabinete. Ligar por um segundo e desligar indica prote\u00e7\u00e3o cortando a alimenta\u00e7\u00e3o por curto ou tens\u00e3o fora da faixa.",
          "Ventoinha girando sem imagem costuma ser mem\u00f3ria, entrada errada no monitor ou placa de v\u00eddeo sem alimenta\u00e7\u00e3o auxiliar. Bips ou LED de diagn\u00f3stico s\u00e3o o melhor cen\u00e1rio: a placa est\u00e1 viva e informa onde parou."
        ]
      },
      {
        "titulo": "Verifica\u00e7\u00f5es seguras antes de abrir o gabinete",
        "paragrafos": [
          "Teste cabo e tomada com outro aparelho, confira a chave 110/220 da fonte, observe se h\u00e1 LED aceso na placa com o PC desligado e anote a sequ\u00eancia de bips. Confirme tamb\u00e9m se o monitor est\u00e1 na entrada correta.",
          "O que n\u00e3o recomendamos: ligar repetidamente ap\u00f3s estalo ou cheiro de queimado, usar fonte emprestada de pot\u00eancia menor, for\u00e7ar encaixe de mem\u00f3ria e aplicar l\u00edquido de limpeza sobre a placa."
        ]
      },
      {
        "titulo": "O que resolve cada cen\u00e1rio e quais s\u00e3o as condi\u00e7\u00f5es",
        "paragrafos": [
          "Medi\u00e7\u00e3o das tens\u00f5es sob carga com fonte de refer\u00eancia define se a fonte \u00e9 a causa. Montagem m\u00ednima em bancada separa defeito real de curto provocado pelo gabinete. Falha no circuito de alimenta\u00e7\u00e3o da placa segue para reparo em n\u00edvel de componente.",
          "Se a m\u00e1quina n\u00e3o for vi\u00e1vel, a unidade de armazenamento \u00e9 lida \u00e0 parte e os arquivos s\u00e3o entregues em m\u00eddia separada antes de qualquer decis\u00e3o sobre substituir o equipamento.",
          "Atendimento apenas por coleta e entrega no endere\u00e7o informado, sem balc\u00e3o. Nenhuma pe\u00e7a \u00e9 trocada sem sua aprova\u00e7\u00e3o. Garantia de 90 dias sobre m\u00e3o de obra e pe\u00e7as aplicadas, limitada ao bloco reparado."
        ]
      }
    ]
  },

  {
    "path": "/problemas/teclado-de-notebook-nao-funciona",
    "title": "Teclado do Notebook N\u00e3o Funciona: Causas e Troca | Curitiba",
    "description": "Teclas que n\u00e3o respondem, teclado morto ou digitando sozinho? Entenda quando \u00e9 software, cabo flat, l\u00edquido ou placa, o que a troca resolve e como funciona.",
    "h1": "Teclado de notebook n\u00e3o funciona: quando \u00e9 ajuste, quando \u00e9 pe\u00e7a",
    "subtitulo": "Parte dos casos \u00e9 layout de idioma trocado, cabo flat solto ou res\u00edduo sob a tecla. A outra parte precisa de substitui\u00e7\u00e3o, e o custo muda conforme o teclado seja pe\u00e7a independente ou venha rebitado \u00e0 carca\u00e7a.",
    "blocos": [
      {
        "titulo": "Dois grupos de causa, custos muito diferentes",
        "paragrafos": [
          "No primeiro grupo est\u00e3o as falhas que n\u00e3o exigem pe\u00e7a: idioma configurado errado, driver corrompido ap\u00f3s atualiza\u00e7\u00e3o, cabo flat solto do conector e sujeira sob teclas espec\u00edficas. S\u00e3o casos de ajuste ou limpeza.",
          "No segundo est\u00e3o membrana rompida por desgaste, res\u00edduo de l\u00edquido entre as camadas e cabo flat partido na dobradi\u00e7a. A\u00ed a substitui\u00e7\u00e3o \u00e9 inevit\u00e1vel, e testar antes evita comprar teclado para um problema que era de configura\u00e7\u00e3o."
        ]
      },
      {
        "titulo": "Sintomas e o que cada um costuma indicar",
        "paragrafos": [
          "Teclado inteiro parado aponta cabo flat ou conector. Teclas isoladas apontam membrana ou sujeira, e falhas na mesma linha ou coluna indicam trilha rompida. Caracteres repetidos sugerem res\u00edduo mantendo contato permanente.",
          "Falha que muda conforme o \u00e2ngulo da tela \u00e9 cabo flat na dobradi\u00e7a. Teclado e touchpad parando juntos mudam o cen\u00e1rio: costuma ser o controlador na placa-m\u00e3e, n\u00e3o o teclado."
        ]
      },
      {
        "titulo": "Verifica\u00e7\u00f5es que voc\u00ea mesmo pode fazer",
        "paragrafos": [
          "Ligue um teclado USB para separar sistema de hardware, teste dentro da BIOS, que roda antes do Windows, e confira o idioma configurado antes de concluir defeito. Observe se a falha muda ao mover a tela.",
          "O que n\u00e3o recomendamos: lavar o teclado com \u00e1gua, secar com secador quente, arrancar teclas com objeto met\u00e1lico e continuar digitando em teclado que recebeu l\u00edquido a\u00e7ucarado."
        ]
      },
      {
        "titulo": "O que resolve cada cen\u00e1rio e quais s\u00e3o as condi\u00e7\u00f5es",
        "paragrafos": [
          "Reencaixe e limpeza do conector ZIF resolvem boa parte dos casos sem troca de pe\u00e7a. Quando a membrana est\u00e1 comprometida, a substitui\u00e7\u00e3o \u00e9 por pe\u00e7a de mesmo layout e conector, testada tecla a tecla antes de fechar.",
          "Casos com l\u00edquido passam por limpeza t\u00e9cnica com desmontagem completa e secagem controlada. Falha simult\u00e2nea de teclado e touchpad segue para avalia\u00e7\u00e3o em n\u00edvel de componente.",
          "Atendimento apenas por coleta e entrega no endere\u00e7o informado, sem balc\u00e3o. Garantia de 90 dias sobre m\u00e3o de obra e teclado aplicado; novo derramamento, queda ou press\u00e3o sobre a carca\u00e7a s\u00e3o danos novos."
        ]
      }
    ]
  },

  {
    "path": "/problemas/hd-nao-reconhecido",
    "title": "HD ou SSD Não é Reconhecido: O Que Fazer | Curitiba",
    "description": "O computador não reconhece o HD ou SSD? Entenda a diferença entre falha de cabo, de partição e de mecânica, por que insistir reduz a chance de recuperar arquivos.",
    "h1": "HD ou SSD não reconhecido: o que fazer antes de perder os arquivos",
    "subtitulo": "Quando o disco some, a diferença entre recuperar tudo e perder tudo costuma estar nas duas horas seguintes — e quase toda tentativa caseira consome parte dessa chance.",
    "blocos": [
      {
        "titulo": "Por que a ordem importa mais que a ferramenta",
        "paragrafos": [
          "Ligar repetidamente um disco com problema mecânico desgasta a superfície. Aceitar a formatação sugerida reescreve a estrutura de pastas. Instalar programa de recuperação no mesmo computador grava dados por cima da área que se queria salvar.",
          "Por isso o primeiro passo em bancada não é recuperar: é preservar. A leitura é feita setor a setor para uma cópia, e todo o trabalho acontece sobre essa cópia, de modo que uma tentativa não reduza a chance da seguinte."
        ]
      },
      {
        "titulo": "Sintomas e o que cada um costuma indicar",
        "paragrafos": [
          "Disco que some da BIOS indica problema físico ou de conexão, e nenhum programa instalado no sistema resolve esse caso. Disco visível na BIOS com sistema que não inicia costuma ser tabela de partição corrompida, com os arquivos ainda presentes.",
          "Clique ritmado indica falha mecânica e pede desligamento imediato. Unidade que conecta e desconecta sozinha aponta alimentação insuficiente ou mau contato. SSD costuma falhar de forma abrupta, sem aviso prévio."
        ]
      },
      {
        "titulo": "Sequência segura antes de qualquer tentativa",
        "paragrafos": [
          "Confira na BIOS se o disco aparece, não aceite a oferta de formatar, troque cabo e porta antes de concluir que o disco morreu e, em gaveta externa, teste com fonte própria. Não instale programas de recuperação no disco que você quer recuperar.",
          "O que não recomendamos em nenhuma hipótese: congelar o HD, bater no aparelho, abrir a unidade fora de ambiente controlado e rodar verificação de erros em disco com falha física."
        ]
      },
      {
        "titulo": "O que resolve cada cenário e quais são as condições",
        "paragrafos": [
          "Uma parte real dos casos termina na verificação de cabo, porta e alimentação, sem troca de peça. Partição corrompida segue para recuperação lógica sobre cópia. Ruído mecânico exige avaliação de viabilidade, com a chance real informada antes.",
          "Resolvida a urgência, o passo que evita a repetição é a substituição por unidade nova com rotina de backup que funcione sem depender da sua memória.",
          "Atendimento apenas por coleta e entrega no endereço informado, sem balcão. Arquivos entregues em mídia separada, nunca de volta na unidade que falhou. Não existe garantia de resultado em recuperação: garantimos transparência sobre a chance, trabalho sobre cópia e laudo quando não for possível."
        ]
      }
    ]
  },

  {
    "path": "/problemas/notebook-nao-liga",
    "title": "Notebook Não Liga? Assistência Técnica em Curitiba",
    "description": "Notebook não liga ou liga sem imagem? Entenda os sinais, as causas possíveis, os testes externos seguros e como funciona o diagnóstico técnico em Curitiba.",
    "h1": "Notebook não liga: o que pode estar acontecendo e como é feito o diagnóstico",
    "blocos": [
      {
        "titulo": "\"Não liga\" e \"liga sem imagem\" são problemas diferentes",
        "paragrafos": [
          "Quando o equipamento não reage de nenhuma forma — sem LED, sem ventoinha, sem vibração —, a investigação começa pela alimentação: carregador, tomada, conector de energia, bateria e circuito de entrada da placa.",
          "Quando existe algum sinal de vida, a investigação passa para memória, vídeo, tela, cabo interno, BIOS e armazenamento. Essa distinção evita o erro mais caro na prática: trocar peça por suposição."
        ]
      },
      {
        "titulo": "Testes externos que você pode fazer com segurança",
        "paragrafos": [
          "Testar outra tomada, observar se algum LED acende ou pisca, remover periféricos externos, conferir a integridade do carregador e registrar sons, piscadas ou mensagens na tela.",
          "Não recomendamos desmontagem, medições com o aparelho energizado, intervenções na fonte ou ressolda. Após líquido, cheiro de queimado, estalo, bateria inchada ou queda, o correto é não insistir e encaminhar para avaliação."
        ]
      },
      {
        "titulo": "Como funciona o diagnóstico e o que influencia o reparo",
        "paragrafos": [
          "A avaliação confirma primeiro se há energia entrando, depois se o equipamento inicializa e, por fim, se apresenta imagem e carrega o sistema. Cada etapa elimina hipóteses e reduz troca desnecessária de peça.",
          "O esforço e o valor variam conforme a causa confirmada, o modelo, a disponibilidade da peça e a necessidade de bancada. Peças e materiais são tratados à parte, e nada é executado sem a sua autorização.",
          "Em boa parte dos casos os arquivos continuam preservados, porque a falha está na energia, na tela ou na placa. Quando a suspeita recai sobre o armazenamento, preservar os dados passa a ser prioridade."
        ]
      }
    ],
    "subtitulo": "Sinais que separam falta de energia de falta de imagem, causas possíveis, verificações seguras, situações em que não se deve insistir e como a avaliação técnica confirma a causa antes de qualquer valor informado."
  },
  {
    "path": "/quando-nao-compensa",
    "title": "Quando NÃO Compensa Reparar | Guia Técnico - Curitiba",
    "description": "Guia completo sobre quando compensa e quando NÃO compensa reparar computadores, notebooks, TVs e outros equipamentos. Dicas de um técnico profissional em Curitiba."
  },
  {
    "path": "/blog",
    "title": "Blog Técnico | Manutenção e Suporte de Informática",
    "description": "Artigos técnicos revisados sobre manutenção de computadores, notebooks, redes e organização de TI, escritos pela operação que atende Curitiba e região.",
    "localBusiness": false
  },
  {
    "path": "/anuncie",
    "title": "Anuncie no Técnico em Curitiba | Mídia Kit",
    "description": "Espaços de divulgação para marcas e prestadores locais no portal Técnico em Curitiba. Formatos, critérios editoriais e como solicitar o mídia kit.",
    "localBusiness": false
  }
];


// Landings serviço × bairro: metadados espelhados de servicoBairroFactory.ts
// (H1 e FAQ reais), garantindo paridade entre HTML estático e hidratação.
const SERVICO_BAIRRO_ROUTES = SERVICO_BAIRRO.map((e) => servicoBairroMeta(e.path)).filter(Boolean);

// P0 comerciais: anexa a FAQ real já exibida na página (sem inventar conteúdo),
// para que FAQPage estático e conteúdo visível fiquem em paridade.
const BASE_ROUTES_WITH_FAQ = BASE_ROUTES.map((r) => {
  const faq = r.faq ?? priorityFaq(r.path) ?? servicoFaqs(r.path) ?? cidadeFaqs(r.path);
  const offers = priorityOffers(r.path);
  const blocos = r.blocos ?? servicoBlocos(r.path);
  return { ...r, ...(faq ? { faq } : {}), ...(offers ? { offers } : {}), ...(blocos ? { blocos } : {}) };
});

// Landings Wi-Fi / Smart TV × bairro (Onda 1): espelho direto de
// wifiTvBairroData.ts, para HTML estático com canonical self.
export const CURATED_ROUTES = [...BASE_ROUTES_WITH_FAQ, ...SERVICO_BAIRRO_ROUTES, ...WIFI_TV_BAIRRO_ROUTES];
