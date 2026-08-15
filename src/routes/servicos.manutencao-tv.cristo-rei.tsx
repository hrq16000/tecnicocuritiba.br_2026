import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvCristoRei from "@/pages/servico-bairro/ManutencaoTvCristoRei";

export const Route = createFileRoute("/servicos/manutencao-tv/cristo-rei")({
  component: ManutencaoTvCristoRei,
});
