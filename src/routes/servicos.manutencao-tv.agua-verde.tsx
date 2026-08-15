import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvAguaVerde from "@/pages/servico-bairro/ManutencaoTvAguaVerde";

export const Route = createFileRoute("/servicos/manutencao-tv/agua-verde")({
  component: ManutencaoTvAguaVerde,
});
