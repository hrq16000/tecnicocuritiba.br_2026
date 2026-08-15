import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvCabral from "@/pages/servico-bairro/ManutencaoTvCabral";

export const Route = createFileRoute("/servicos/manutencao-tv/cabral")({
  component: ManutencaoTvCabral,
});
