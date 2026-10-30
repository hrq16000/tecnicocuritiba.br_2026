import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { createElement } from "react";
import { seoHead } from "@/lib/seo/routeHead";
import { isNoindexByEnrichment } from "@/lib/enrichmentStatus";
// Metadados SSR independentes do catálogo pesado; conteúdo não alterado.
// O corpo do serviço é importado na navegação, mantendo o head no SSR.

const PATH = "/servicos/conserto-impressora-3d";
// Cópia estritamente SEO dos 10 FAQs: evita que o head síncrono importe
// 277 KB de dados de serviços para o bundle inicial. Paridade coberta por teste.
const data = {
  metaTitle: "Conserto de Impressora 3D em Curitiba | Bico, Termistor e Placa",
  metaDescription: "Manutenção e conserto de impressora 3D em Curitiba: bico entupido, extrusora, termistor, resistência, eixos, placa e firmware. Mínimo pré-aprovado de R$ 500,00, com coleta e entrega.",
    faqs: [
      { question: "Por que o valor mínimo da impressora 3D é maior?", answer: "Porque o diagnóstico é obrigatoriamente completo. Em uma impressora 3D não existe teste rápido conclusivo: o mesmo sintoma de falha de extrusão pode vir do bico, do tubo, da engrenagem tracionadora, do termistor, da resistência, do driver do motor ou de um parâmetro de firmware. Fechar o caso exige montar a máquina em bancada, aquecer, medir sob carga, corrigir, calibrar e imprimir uma peça de validação, o que ocupa a bancada por um período longo. Por isso qualquer serviço em impressora 3D tem mínimo pré-aprovado de R$ 500,00, com coleta e entrega inclusas e peças não inclusas. Esse valor é dito na triagem, antes de a máquina sair da sua casa." },
      { question: "Bico entupido resolve mesmo ou volta a entupir?", answer: "Resolve, e a diferença está em tratar a causa e não só o entupimento. Limpar ou trocar o bico pode restabelecer a extrusão após os testes de validação, mas entupimento repetido quase sempre tem origem em outro ponto: tubo de PTFE mal assentado ou queimado na ponta, folga entre tubo e bico criando câmara de acúmulo, temperatura configurada abaixo do material, filamento úmido ou com carga abrasiva, e ventilação insuficiente no dissipador do hotend. No diagnóstico verificamos esses pontos e registramos no laudo o que estava fora. Quando a causa é o material ou a armazenagem do filamento, dizemos isso claramente — trocar peça não resolveria." },
      { question: "Vocês mexem em impressora de resina também?", answer: "Sim, com escopo declarado. Atendemos falha elétrica, placa que não inicializa, tela LCD de exposição, motor e fuso do eixo Z, sensores e recuperação de firmware. O que não fazemos é assumir responsabilidade por resina residual, tanque perfurado e cura irregular por resina fora de validade, e também não descartamos resina do cliente. A máquina precisa chegar limpa, sem resina no tanque, por segurança de manuseio na bancada. Quando isso não é possível, orientamos na triagem antes da coleta." },
      { question: "O atendimento é na minha casa ou por coleta?", answer: "Por coleta e entrega, sempre. Impressora 3D não é serviço de visita rápida: o reparo depende de aquecer o conjunto, medir sob carga, calibrar e imprimir uma peça de teste, o que não cabe em um atendimento no endereço sem bancada. O valor mínimo pré-aprovado já inclui a coleta e a entrega dentro da área atendida. Se a máquina foi montada no local e não pode ser movida, avaliamos o caso na triagem antes de qualquer compromisso." },
      { question: "Qual é a garantia do conserto de impressora 3D?", answer: "90 dias sobre a mão de obra e sobre o ponto reparado, contados da entrega. Cobre o defeito tratado e o componente que substituímos. Não estão cobertos: entupimento novo por filamento úmido, abrasivo ou de baixa qualidade, desnivelamento causado por transporte ou por remontagem posterior, alteração de firmware ou de parâmetros feita depois da entrega, dano por surto elétrico, e peças de desgaste como bico, tubo e correia quando o uso as consome. A calibração entregue vale para o material que você declarou; trocar para outro material exige recalibrar, e isso é normal na tecnologia." },
      { question: "Vocês fazem upgrade de impressora 3D?", answer: "Fazemos, dentro do que é tecnicamente sustentável: troca de hotend, extrusão direta, sensor de nivelamento, placa controladora com drivers mais silenciosos, fonte e estabilização de estrutura. O que não prometemos é ganho de velocidade ou de qualidade em número, porque o resultado depende do modelo, do material e do perfil de fatiamento. O upgrade também entra no mínimo pré-aprovado de R$ 500,00, e a peça de upgrade não está inclusa nesse valor — ela é aprovada por você por escrito antes da compra ou instalada se você já a tiver." },
      { question: "A máquina não liga mais depois de uma atualização. Tem recuperação?", answer: "Em boa parte dos casos sim. Placa que não inicializa depois de atualização costuma estar com firmware incompleto, com arquivo incompatível com a revisão da placa ou com o carregador de inicialização corrompido. Em bancada tentamos a regravação pelos caminhos que a placa oferece, e quando existe acesso de programação recuperamos sem trocar a peça. Quando a placa tem dano elétrico associado — driver queimado, trilha aberta, conversor de tensão em curto — o caminho passa a ser reparo em nível de componente ou substituição, e você recebe as duas opções com valor antes de decidir." },
      { question: "O que preciso enviar junto com a impressora?", answer: "A fonte de alimentação e o cabo, sempre, porque em muitos casos o defeito está na alimentação e não na máquina. Envie também uma amostra do filamento ou a informação exata do material que você usa, já que a calibração final é feita para ele. Se o problema aparece com um modelo específico, mande o arquivo fatiado ou o print da configuração — isso encurta o diagnóstico. Retire resina do tanque em impressoras de resina e remova acessórios soltos da mesa. A embalagem é orientada na triagem conforme o tamanho e o tipo da estrutura." },
      { question: "E se a avaliação mostrar que não vale reparar?", answer: "Você recebe o laudo dizendo isso, com o que foi testado e o motivo. Acontece principalmente em máquinas de entrada muito antigas em que placa, tela e conjunto de extrusão falharam juntos: a soma das peças passa do valor de uma impressora nova equivalente, e não recomendamos o reparo nesse cenário. Nesse caso o mínimo pré-aprovado cobre a avaliação em bancada e a logística, e a máquina volta montada, com todas as peças, no mesmo estado em que chegou. Não retemos equipamento e não cobramos por reparo que não fizemos." },
      { question: "Vocês imprimem peças ou só consertam a máquina?", answer: "Esta página é de manutenção e reparo do equipamento. Não vendemos serviço de impressão sob demanda nem prometemos produção de peças. A única impressão que fazemos é a peça de validação do reparo, feita na sua própria máquina, com o seu material, para provar no laudo que o conjunto voltou a operar de forma estável. Se o seu objetivo é obter peças impressas, e não recuperar a impressora, este não é o atendimento correto e dizemos isso na triagem." },
    ],
};

export const Route = createFileRoute("/servicos/conserto-impressora-3d")({
  head: () =>
    seoHead({
      path: PATH,
      title: data.metaTitle,
      description: data.metaDescription,
      faq: data.faqs,
      // Fail-closed: sem galeria de prova visual aprovada a rota fica SHALLOW.
      noindex: isNoindexByEnrichment(PATH),
    }),
  component: lazyRouteComponent(() =>
    import("@/pages/servicos/ServicoCore").then(({ default: ServicoCore }) => ({
      default: () => createElement(ServicoCore, { slug: "conserto-impressora-3d" }),
    })),
  ),
});
