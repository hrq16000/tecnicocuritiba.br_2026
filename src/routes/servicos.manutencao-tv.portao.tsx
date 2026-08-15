import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvPortao from "@/pages/servico-bairro/ManutencaoTvPortao";

export const Route = createFileRoute("/servicos/manutencao-tv/portao")({
  component: ManutencaoTvPortao,
});
