import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvBigorrilho from "@/pages/servico-bairro/ManutencaoTvBigorrilho";

export const Route = createFileRoute("/servicos/manutencao-tv/bigorrilho")({
  component: ManutencaoTvBigorrilho,
});
