import { ServicoBairroTemplate } from "./ServicoBairroTemplate";
import { buildTvBairroData } from "./wifiTvBairroData";

const ManutencaoTvJardimAmericas = () => {
  const data = buildTvBairroData("jardim-das-americas");
  return <ServicoBairroTemplate data={{
    ...data,
    descricaoLonga: `${data.descricaoLonga} Para preparar a triagem da televisão no Jardim das Américas, anote o código completo do modelo na etiqueta externa e descreva o comportamento ao ligar. Tela escura com áudio, iluminação irregular, linhas fixas e reinicializações são sintomas diferentes; nenhum deles, isoladamente, confirma qual peça precisa de reparo. Informe se o menu do próprio aparelho aparece e se o defeito ocorre também em outra entrada, sem desmontar a TV. Se apenas um aplicativo falha, registre qual é e se os demais funcionam: isso ajuda a separar uma dificuldade de software de uma falha de imagem. Não pressione o painel nem aplique produtos na tela para tentar corrigir manchas. Antes de combinar a coleta, informe o tamanho aproximado, se o televisor está preso a um suporte e se há restrição de acesso no imóvel. A retirada precisa considerar a fixação e a proteção do painel durante o transporte. Havendo cheiro de queimado, aquecimento anormal ou sinais de líquido, interrompa o uso e relate a situação. Não abra a carcaça: componentes internos podem manter carga elétrica. A decisão entre reparar e substituir depende da avaliação e da disponibilidade da peça, com condições apresentadas antes da execução.`,
  }} />;
};

export default ManutencaoTvJardimAmericas;
