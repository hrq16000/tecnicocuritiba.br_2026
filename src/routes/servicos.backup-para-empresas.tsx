import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/backup-para-empresas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/backup-para-empresas",
    "title": "Backup para Empresas em Curitiba | Proteção de Arquivos",
    "description": "Backup para empresas em Curitiba: avaliação do que existe hoje, cópia local, cópia externa, nuvem, retenção, versionamento e teste de restauração.",
    "faq": [
      {
        "question": "Google Drive ou OneDrive já são backup?",
        "answer": "Não por si só. Esses serviços são de sincronização: se um arquivo é apagado, corrompido ou criptografado por um vírus na máquina, a alteração se propaga para a nuvem. Eles ajudam quando o versionamento e a lixeira estão configurados e conhecidos, mas continuam sendo uma camada, não o backup completo."
      },
      {
        "question": "Quantas cópias a empresa deve ter?",
        "answer": "A prática mais aceita é manter pelo menos duas cópias além do original, em mídias ou serviços diferentes, e uma delas fora do ambiente físico da empresa. Adaptamos essa regra ao volume, aa verba disponível para infraestrutura e à criticidade dos arquivos."
      },
      {
        "question": "O backup precisa ficar fora da empresa?",
        "answer": "Uma das cópias sim. Incêndio, furto, dano elétrico e infecção que se espalha pela rede atingem tudo que está no mesmo local e conectado. A cópia externa é justamente o que sobra quando o pior acontece no endereço."
      },
      {
        "question": "Como saber se a restauração funciona?",
        "answer": "Testando. Selecionamos uma amostra representativa, restauramos em local separado e conferimos se os arquivos abrem íntegros. Backup nunca testado é apenas uma suposição, e é assim que a maioria das empresas descobre o problema no pior momento."
      },
      {
        "question": "Backup protege contra ransomware?",
        "answer": "Ajuda, e é a defesa mais efetiva na prática, desde que exista cópia desconectada ou com versionamento que o ataque não consiga alterar. Cópia permanentemente conectada à mesma rede pode ser criptografada junto. Não prometemos proteção absoluta contra ataque."
      },
      {
        "question": "Quem deve ter acesso?",
        "answer": "O menor número possível de pessoas, com responsável nomeado e substituto definido. Acesso amplo à rotina de cópia aumenta o risco de exclusão acidental e de exposição de dados sensíveis."
      },
      {
        "question": "O serviço inclui armazenamento?",
        "answer": "Não. Discos, dispositivos e planos de nuvem são contratados pela empresa. Indicamos o que é compatível com o volume e o uso, e configuramos a rotina sobre o recurso escolhido, sem oferecer armazenamento ilimitado."
      },
      {
        "question": "Vocês garantem que os arquivos sempre voltam?",
        "answer": "Não. Backup reduz o risco de perda, mas nenhuma rotina elimina totalmente a possibilidade de falha. Quando o arquivo já foi perdido e não existe cópia, o caminho é a avaliação de recuperação de dados, que também não tem resultado assegurado."
      },
      {
        "question": "Backup atende às exigências da LGPD?",
        "answer": "Backup é uma das medidas técnicas que apoiam a proteção de dados, mas conformidade não é automática: depende de políticas internas, base legal, controle de acesso e tratamento adequado dos dados pessoais pela própria empresa. Não emitimos declaração de conformidade."
      },
      {
        "question": "Com que frequência a cópia deve ser feita?",
        "answer": "Pela pergunta inversa: quanto trabalho a empresa aceita refazer. Se refazer um dia inteiro é inviável, a rotina precisa ser diária ou mais frequente. Definimos frequência e retenção junto com você, em vez de aplicar um padrão único."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="backup-para-empresas" />,
});
