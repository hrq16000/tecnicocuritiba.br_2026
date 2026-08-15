import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvBatel from "@/pages/servico-bairro/ManutencaoTvBatel";

export const Route = createFileRoute("/servicos/manutencao-tv/batel")({
  component: ManutencaoTvBatel,
});
