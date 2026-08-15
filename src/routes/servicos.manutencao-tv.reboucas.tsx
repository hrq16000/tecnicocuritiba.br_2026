import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvReboucas from "@/pages/servico-bairro/ManutencaoTvReboucas";

export const Route = createFileRoute("/servicos/manutencao-tv/reboucas")({
  component: ManutencaoTvReboucas,
});
