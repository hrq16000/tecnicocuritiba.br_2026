import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvCic from "@/pages/servico-bairro/ManutencaoTvCic";

export const Route = createFileRoute("/servicos/manutencao-tv/cic")({
  component: ManutencaoTvCic,
});
