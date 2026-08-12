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
    "description": "Assistência técnica de notebook em Curitiba: lentidão, aquecimento, tela, teclado, bateria e limpeza interna. Todas as marcas. Diagnóstico antes de informar o valor via WhatsApp."
  },
  {
    "path": "/servicos/manutencao-de-computador",
    "title": "Assistência Técnica de Computador em Curitiba | PC",
    "description": "Assistência técnica de computador em Curitiba: travamentos, fonte, memória, HD/SSD e placa-mãe. Casa e empresa. Diagnóstico honesto antes de informar o valor via WhatsApp."
  },
  {
    "path": "/servicos/upgrade-ssd-ram",
    "title": "Instalação de SSD e Upgrade de Memória em Curitiba",
    "description": "Instalação de SSD e upgrade de memória RAM em Curitiba com avaliação de compatibilidade, clonagem e backup. Ganho real de desempenho, sem promessa de milagre. Via WhatsApp."
  },
  {
    "path": "/servicos/remocao-de-virus",
    "title": "Remoção de Vírus e Malware em Curitiba | PC e Notebook",
    "description": "Remoção de vírus, malware e sequestro de navegador em Curitiba. Limpeza segura, proteção dos seus dados e reinstalação quando necessário. Atendimento via WhatsApp."
  },
  {
    "path": "/servicos/recuperacao-de-dados",
    "title": "Recuperação de Dados em Curitiba | HD, SSD e Pendrive",
    "description": "Recuperação de dados em Curitiba de HD, SSD, pendrive e cartão. Exclusão acidental, sistema que não inicia e falhas. Avaliação primeiro — recuperação não é garantida."
  },
  {
    "path": "/servicos/redes-e-wifi",
    "title": "Configuração de Redes e Wi-Fi em Curitiba | Roteadores",
    "description": "Configuração de redes e Wi-Fi em Curitiba: internet instável, roteador, repetidor, cabeamento e rede empresarial. Cobertura melhor em casa e no trabalho. Via WhatsApp."
  },
  {
    "path": "/servicos/suporte-tecnico-empresarial",
    "title": "Suporte Técnico para Empresas em Curitiba | Informática",
    "description": "Suporte técnico de informática para empresas em Curitiba, com atendimento para computadores, usuários, redes, impressoras e manutenção preventiva."
  },
  {
    "path": "/servicos/manutencao-preventiva-empresas",
    "title": "Manutenção Preventiva de Computadores em Curitiba | Empresas",
    "description": "Manutenção preventiva de computadores para empresas em Curitiba: inventário, inspeção, armazenamento, atualizações e relatório de riscos priorizado, sem promessa de zero falhas."
  },
  {
    "path": "/servicos/backup-para-empresas",
    "title": "Backup para Empresas em Curitiba | Proteção de Arquivos",
    "description": "Backup para empresas em Curitiba: avaliação do que existe hoje, cópia local, cópia externa, nuvem, retenção, versionamento e teste de restauração. Sem promessa de proteção absoluta."
  },
  {
    "path": "/servicos/conserto-tv",
    "title": "Conserto de TV e Smart TV em Curitiba | Bancada e Coleta",
    "description": "Conserto de TV LED, LCD e Smart TV em Curitiba: avaliação em bancada, reparo em nível de componente quando viável, coleta e entrega. Critérios de aceite e recusa informados antes."
  },
  {
    "path": "/servicos/conserto-placa",
    "title": "Reparo de Placa Eletrônica em Curitiba | Nível de Componente",
    "description": "Reparo de placa-mãe de notebook, placa de PC e placa de TV em Curitiba: avaliação em bancada, reparo em nível de componente, retrabalho de BGA quando viável, coleta e entrega."
  },
  {
    "path": "/servicos/conserto-monitor",
    "title": "Conserto de Monitor em Curitiba | Bancada, Coleta e Entrega",
    "description": "Conserto de monitor em Curitiba: avaliação em bancada, reparo de fonte, placa e backlight quando viável, coleta e entrega. Não fazemos troca de painel — critério informado antes."
  },
  {
    "path": "/servicos/montagem-de-pc",
    "title": "Montagem de PC e PC Gamer em Curitiba | Testes Inclusos",
    "description": "Montagem e configuração de computadores em Curitiba: verificação de compatibilidade, instalação dos componentes, BIOS, sistema, drivers e testes antes da entrega. Peças do cliente aceitas.",
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
    "description": "Suporte técnico para quem trabalha em casa em Curitiba: computador lento, Wi-Fi instável, câmera e microfone em reuniões, e-mail, arquivos e preparação do posto de trabalho."
  },
  {
    "path": "/politica-de-pecas-do-cliente",
    "title": "Política de Peças do Cliente | Montagem em Curitiba",
    "description": "Regras claras para peças fornecidas pelo cliente em Curitiba: compatibilidade, procedência, integridade no recebimento, prazo de troca, garantia da peça x garantia da mão de obra e valor declarado do equipamento.",
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
    "description": "Como arquivos, senhas e acessos são tratados durante a assistência técnica em Curitiba: autorização, acesso mínimo, backup prévio, cópias temporárias, limites e responsabilidades.",
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
    "description": "Entenda como funciona o atendimento técnico de informática em Curitiba e região. Passo a passo completo: solicitação via WhatsApp, diagnóstico, execução e garantia. Técnico a domicílio no mesmo dia.",
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
    "description": "Técnico de informática em São José dos Pinhais: formatação, conserto de notebook e PC, upgrade de SSD, redes e suporte a empresas. Atendimento a domicílio ou coleta via WhatsApp."
  },
  {
    "path": "/tecnico-informatica-pinhais",
    "title": "Técnico em Pinhais para Notebook, PC e Redes",
    "description": "Técnico de informática em Pinhais: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial. Atendimento a domicílio ou coleta via WhatsApp."
  },
  {
    "path": "/tecnico-informatica-colombo",
    "title": "Técnico em Colombo para Notebook, PC e Informática",
    "description": "Técnico de informática em Colombo: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial. Atendimento a domicílio ou coleta via WhatsApp."
  },
  {
    "path": "/tecnico-informatica-araucaria",
    "title": "Técnico em Araucária para Notebook, PC e Empresas",
    "description": "Técnico de informática em Araucária: formatação, conserto de notebook e PC, upgrade de SSD, redes e suporte empresarial. Atendimento a domicílio ou coleta via WhatsApp."
  },
  {
    "path": "/tecnico-informatica-campo-largo",
    "title": "Técnico em Campo Largo para Notebook, PC e Redes",
    "description": "Técnico de informática em Campo Largo: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial. Atendimento a domicílio ou coleta via WhatsApp."
  },
  {
    "path": "/tecnico-informatica-piraquara",
    "title": "Técnico em Piraquara para Notebook, PC e Internet",
    "description": "Técnico de informática em Piraquara: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus e Wi-Fi. Atendimento a domicílio ou coleta combinada por WhatsApp."
  },
  {
    "path": "/tecnico-informatica-quatro-barras",
    "title": "Técnico em Quatro Barras para PC, Notebook e Redes",
    "description": "Técnico de informática em Quatro Barras: conserto de notebook e PC, formatação, upgrade de SSD, redes e suporte a pequenas empresas. Visita agendada ou coleta via WhatsApp."
  },
  {
    "path": "/tecnico-informatica-campo-magro",
    "title": "Técnico em Campo Magro para Notebook, PC e Wi-Fi",
    "description": "Técnico de informática em Campo Magro: conserto de notebook e PC, formatação, upgrade de SSD, remoção de vírus e Wi-Fi em chácaras e casas. Atendimento combinado por WhatsApp."
  },
  {
    "path": "/tecnico-informatica-almirante-tamandare",
    "title": "Técnico em Almirante Tamandaré | Notebook e PC",
    "description": "Técnico de informática em Almirante Tamandaré: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus e redes. Visita agendada ou coleta via WhatsApp."
  },
  {
    "path": "/tecnico-informatica-fazenda-rio-grande",
    "title": "Técnico em Fazenda Rio Grande | PC, Notebook e Rede",
    "description": "Técnico de informática em Fazenda Rio Grande: conserto de notebook e PC, formatação, upgrade de SSD, remoção de vírus e redes. Atendimento agendado ou coleta via WhatsApp."
  },
  {
    "path": "/empresa-de-ti-curitiba",
    "title": "Empresa de TI em Curitiba | Soluções para Pequenas Empresas",
    "description": "Soluções de informática para empresas em Curitiba: diagnóstico do ambiente, computadores, redes, manutenção e organização do suporte técnico."
  },
  {
    "path": "/bairros/cic",
    "title": "Técnico de Informática no CIC (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no CIC, Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para empresas. Diagnóstico a partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/batel",
    "title": "Técnico de Informática no Batel (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Batel, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Diagnóstico a partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/agua-verde",
    "title": "Técnico de Informática no Água Verde | Notebook e PC",
    "description": "Técnico de informática no Água Verde, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Diagnóstico a partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/centro",
    "title": "Técnico de Informática no Centro de Curitiba | Notebook e PC",
    "description": "Técnico de informática no Centro de Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para escritórios. Diagnóstico a partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/portao",
    "title": "Técnico de Informática no Portão (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Portão, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Atendimento a domicílio a partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/bigorrilho",
    "title": "Técnico de Informática no Bigorrilho (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Bigorrilho e Champagnat, Curitiba: conserto de notebook, formatação, upgrade de SSD e Wi-Fi em apartamento. Diagnóstico a partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/santa-felicidade",
    "title": "Técnico de Informática em Santa Felicidade | Curitiba",
    "description": "Técnico de informática em Santa Felicidade, Curitiba: conserto de PC e notebook, formatação, Wi-Fi em casa grande e suporte a comércio. A partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/cabral",
    "title": "Técnico de Informática no Cabral (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Cabral, Curitiba: conserto de notebook, formatação, upgrade de SSD e suporte a consultórios e escritórios. A partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/cristo-rei",
    "title": "Técnico de Informática no Cristo Rei (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Cristo Rei, Curitiba: conserto de notebook, formatação, upgrade de SSD e Wi-Fi para estudantes e famílias. A partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/boa-vista",
    "title": "Técnico de Informática no Boa Vista (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Boa Vista, Curitiba: conserto de computador e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99. Via WhatsApp."
  },
  {
    "path": "/bairros/cajuru",
    "title": "Técnico de Informática no Cajuru (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Cajuru, Curitiba: conserto de notebook e PC, formatação com backup, remoção de vírus e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp."
  },
  {
    "path": "/bairros/boqueirao",
    "title": "Técnico de Informática no Boqueirão (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Boqueirão, Curitiba: conserto de PC e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp."
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
    "description": "Suporte remoto de informática em Curitiba para configurações, sistema, programas, e-mail, impressora já conectada, orientação e home office — com autorização e acompanhamento.",
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
    "description": "Bairros de Curitiba e cidades da região metropolitana atendidas pelo Técnico em Curitiba, com a modalidade indicada em cada caso: no local, remoto ou coleta para bancada.",
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
    "description": "Notebooks, desktops, PC gamer, All in One, estações de trabalho, equipamentos de home office, redes e armazenamento: o que atendemos em Curitiba, os limites e a modalidade indicada.",
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
    "description": "Guia completo de manutenção de computador e notebook: como identificar a família da falha, o que verificar antes de chamar o técnico, quando o upgrade compensa e como é feito o diagnóstico.",
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
    "description": "Computador ou notebook lento para ligar e abrir programas? Veja os sintomas, as causas possíveis, quando SSD ou memória resolvem, quando formatar e quando trocar o equipamento.",
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
    "description": "Tela azul recorrente no Windows: o que o código de erro indica, quais causas são de memória, disco, driver ou temperatura, o que anotar antes do atendimento e quando formatar não resolve.",
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
    "description": "Notebook esquentando, com cooler acelerado ou desligando sozinho: entenda o que é temperatura normal, quais causas são de poeira, pasta térmica, uso ou falha elétrica, e o que fazer antes do atendimento.",
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
    "description": "Notebook conectado à tomada mas sem carregar, parado em uma porcentagem fixa ou funcionando só no cabo: entenda o que é bateria, carregador, conector de energia ou placa, e o que verificar antes do atendimento.",
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
    "description": "TV que não liga, com LED piscando, som sem imagem ou desligando sozinha: entenda o que é fonte, placa principal, backlight ou painel, o que verificar antes do atendimento e quando o reparo não compensa.",
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
    "description": "Computador ou notebook que desliga sozinho, reinicia do nada ou apaga durante jogos: entenda a diferença entre temperatura, fonte, energia e software, o que observar antes do atendimento e como é feito o diagnóstico.",
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
    "description": "Wi-Fi que cai toda hora, sinal que some em um cômodo ou internet lenta só à noite: entenda a diferença entre falha do provedor, do roteador e da cobertura, o que testar antes e como é feito o diagnóstico de rede em Curitiba.",
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
    "description": "Televisor com som normal e tela apagada: entenda a diferença entre falha de backlight, de placa de fonte e de painel, quais testes indicam cada caso e quando o reparo realmente compensa em Curitiba.",
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
    "description": "Derramou líquido no notebook? Entenda por que ligar o aparelho piora o quadro, o que fazer nas primeiras horas, como funciona a limpeza de placa e em que casos o reparo deixa de compensar. Coleta em Curitiba.",
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
    "description": "Tela trincada, com manchas ou linhas? Entenda a diferença entre painel danificado, cabo flat e placa de vídeo, o que a troca resolve, o que não resolve e como funciona a coleta em Curitiba.",
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
    "path": "/problemas/computador-fazendo-barulho",
    "title": "Computador Fazendo Barulho: Como Identificar a Origem | Curitiba",
    "description": "PC barulhento, ventoinha rugindo, estalo ou zumbido? Entenda como separar cooler, fonte, disco r\u00edgido e ru\u00eddo el\u00e9trico antes de trocar pe\u00e7a, e como funciona a coleta em Curitiba.",
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
    "description": "Televisor com linhas verticais, horizontais ou faixas coloridas na imagem? Entenda quando \u00e9 conex\u00e3o do painel, placa de controle ou dano interno sem reparo vi\u00e1vel, e como funciona a avalia\u00e7\u00e3o por coleta em Curitiba.",
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
    "description": "PC n\u00e3o liga, n\u00e3o d\u00e1 v\u00eddeo ou liga e apaga em seguida? Entenda como separar fonte, bot\u00e3o, placa-m\u00e3e e mem\u00f3ria antes de trocar pe\u00e7a por achismo, e como funciona a coleta em Curitiba.",
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
    "description": "Teclas que n\u00e3o respondem, teclado morto ou digitando sozinho? Entenda quando \u00e9 software, cabo flat, l\u00edquido ou placa, o que a troca resolve e como funciona a coleta em Curitiba.",
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
    "description": "O computador não reconhece o HD ou SSD? Entenda a diferença entre falha de cabo, de partição e de mecânica, por que insistir reduz a chance de recuperar arquivos e como funciona a coleta em Curitiba.",
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
  }
];

// Landings serviço × bairro: metadados espelhados de servicoBairroFactory.ts
// (H1 e FAQ reais), garantindo paridade entre HTML estático e hidratação.
const SERVICO_BAIRRO_ROUTES = SERVICO_BAIRRO.map((e) => servicoBairroMeta(e.path)).filter(Boolean);

// P0 comerciais: anexa a FAQ real já exibida na página (sem inventar conteúdo),
// para que FAQPage estático e conteúdo visível fiquem em paridade.
const BASE_ROUTES_WITH_FAQ = BASE_ROUTES.map((r) => {
  const faq = r.faq ?? priorityFaq(r.path) ?? servicoFaqs(r.path);
  const offers = priorityOffers(r.path);
  const blocos = r.blocos ?? servicoBlocos(r.path);
  return { ...r, ...(faq ? { faq } : {}), ...(offers ? { offers } : {}), ...(blocos ? { blocos } : {}) };
});

// Landings Wi-Fi / Smart TV × bairro (Onda 1): espelho direto de
// wifiTvBairroData.ts, para HTML estático com canonical self.
export const CURATED_ROUTES = [...BASE_ROUTES_WITH_FAQ, ...SERVICO_BAIRRO_ROUTES, ...WIFI_TV_BAIRRO_ROUTES];
