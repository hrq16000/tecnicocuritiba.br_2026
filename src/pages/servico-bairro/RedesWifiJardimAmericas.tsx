import { ServicoBairroTemplate } from "./ServicoBairroTemplate";
import { buildWifiBairroData } from "./wifiTvBairroData";

const RedesWifiJardimAmericas = () => {
  const data = buildWifiBairroData("jardim-das-americas");
  return <ServicoBairroTemplate data={{
    ...data,
    descricaoLonga: `${data.descricaoLonga} No pedido de configuração de rede no Jardim das Américas, descreva em quais cômodos a conexão falha e quais dispositivos apresentam dificuldade. Compare o resultado perto do roteador com o ponto de uso habitual; essa diferença ajuda a identificar cobertura insuficiente. Uma medição por cabo, quando disponível, permite distinguir a entrega da operadora do desempenho do enlace sem fio. Registre também se a lentidão ocorre em todos os horários ou apenas durante chamadas e transmissões simultâneas. Não compartilhe a senha da rede na mensagem inicial. Para planejar pontos de acesso, informe a quantidade de pavimentos, a posição atual do modem e a existência de passagem para cabo. Um repetidor depende da qualidade do sinal recebido no local de instalação; colocá-lo diretamente na área sem cobertura não elimina essa limitação. Sistemas mesh também precisam de posicionamento e conexão adequados entre os nós. Alterações de canal, largura e potência devem considerar o ambiente observado, sem prometer velocidade apenas pela compra de equipamento novo. Antes de restaurar o roteador, confirme se há configurações da operadora, telefonia ou dispositivos que dependem dele, pois a restauração pode interromper outros serviços. A configuração proposta deve preservar os acessos necessários e ser validada nos locais em que a rede será utilizada.`,
  }} />;
};

export default RedesWifiJardimAmericas;
