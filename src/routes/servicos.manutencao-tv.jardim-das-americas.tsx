import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvJardimAmericas from "@/pages/servico-bairro/ManutencaoTvJardimAmericas";

export const Route = createFileRoute("/servicos/manutencao-tv/jardim-das-americas")({
  component: ManutencaoTvJardimAmericas,
});
