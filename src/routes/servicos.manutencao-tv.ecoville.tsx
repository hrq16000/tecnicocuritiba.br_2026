import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvEcoville from "@/pages/servico-bairro/ManutencaoTvEcoville";

export const Route = createFileRoute("/servicos/manutencao-tv/ecoville")({
  component: ManutencaoTvEcoville,
});
