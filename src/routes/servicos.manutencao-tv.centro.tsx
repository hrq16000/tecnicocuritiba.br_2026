import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvCentro from "@/pages/servico-bairro/ManutencaoTvCentro";

export const Route = createFileRoute("/servicos/manutencao-tv/centro")({
  component: ManutencaoTvCentro,
});
