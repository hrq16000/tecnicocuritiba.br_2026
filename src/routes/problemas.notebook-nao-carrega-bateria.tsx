import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaNotebookNaoCarregaBateria from "@/pages/problemas/NotebookNaoCarregaBateria";

export const Route = createFileRoute("/problemas/notebook-nao-carrega-bateria")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/notebook-nao-carrega-bateria",
    "title": "Notebook Não Carrega a Bateria? Diagnóstico em Curitiba",
    "description": "Notebook conectado à tomada mas sem carregar, parado em uma porcentagem fixa ou funcionando só no cabo: entenda o que é bateria, carregador, conector de energia.",
    "faq": [
      {
        "question": "Notebook que só funciona na tomada tem conserto?",
        "answer": "Na maioria dos casos sim, mas o caminho depende da causa. Se a bateria perdeu capacidade, a solução é substituição por peça compatível com o modelo. Se o problema está no conector de energia ou no circuito de carga, o reparo é feito na placa. A avaliação existe justamente para não trocar bateria quando o bloqueio está em outro ponto."
      },
      {
        "question": "Dá para saber se o problema é bateria ou carregador sem abrir o equipamento?",
        "answer": "Boa parte da separação é feita por leitura de dados e teste de alimentação, sem desmontagem. A saúde da bateria pode ser lida pelo próprio sistema e a fonte pode ser medida externamente. A desmontagem só entra quando a suspeita recai sobre conector ou circuito interno."
      },
      {
        "question": "Quanto tempo dura a bateria de um notebook?",
        "answer": "Bateria é peça de consumo e trabalha por ciclos, não por tempo de calendário. Uso diário em carga completa e descarga total consome ciclos mais rápido do que uso predominantemente na tomada com carga parcial. Quando a autonomia cai para poucos minutos, o desgaste normalmente já está no limite."
      },
      {
        "question": "Usar o notebook sempre na tomada estraga a bateria?",
        "answer": "Nos modelos atuais o controlador interrompe a carga ao atingir o limite, então o risco não é o de \"sobrecarregar\". O que acelera o desgaste é o calor: manter o equipamento quente e conectado por muitas horas seguidas afeta a bateria ao longo do tempo. Vários fabricantes oferecem limite de carga justamente para esse cenário."
      },
      {
        "question": "Carregador universal serve no meu notebook?",
        "answer": "Serve quando tensão, corrente e conector correspondem ao exigido pelo modelo. O problema mais comum é potência abaixo do necessário: o equipamento liga, funciona, mas não sobra energia para carregar a bateria. Nesses casos o sintoma aparece como carga travada ou extremamente lenta."
      },
      {
        "question": "Bateria estufada é perigosa?",
        "answer": "Sim. Bateria estufada pressiona teclado, touchpad e carcaça, e não volta ao estado normal. A orientação é interromper o uso, desconectar da tomada e encaminhar para avaliação. O descarte é feito de forma adequada, e a troca depende da disponibilidade de peça compatível com o modelo."
      },
      {
        "question": "Meus arquivos correm risco na troca de bateria ou reparo do conector?",
        "answer": "Nenhuma das duas intervenções envolve apagar dados. Se durante a avaliação for identificada perda de saúde no armazenamento, isso é informado antes de qualquer procedimento, e preservar os arquivos passa à frente do restante."
      },
      {
        "question": "Vocês têm bateria para qualquer modelo?",
        "answer": "Não prometemos disponibilidade universal. Baterias são específicas por modelo e algumas linhas antigas já não têm peça nova de qualidade no mercado. Quando é esse o caso, dizemos abertamente em vez de instalar um componente genérico de procedência duvidosa."
      },
      {
        "question": "O valor pode ser informado antes da avaliação?",
        "answer": "Não com precisão, porque trocar bateria, ressoldar conector e reparar circuito de carga são intervenções de complexidade muito diferente. As condições comerciais vigentes estão publicadas na página de preços e políticas, e o valor é apresentado depois do diagnóstico, dependendo da sua autorização."
      },
      {
        "question": "Preciso levar o notebook até algum endereço?",
        "answer": "Não atendemos em balcão. O contato começa pelo WhatsApp, e o equipamento é retirado e devolvido no endereço combinado, com as condições de coleta descritas na página de coleta e entrega."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaNotebookNaoCarregaBateria,
});
