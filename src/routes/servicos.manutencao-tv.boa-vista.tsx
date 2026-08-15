import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvBoaVista from "@/pages/servico-bairro/ManutencaoTvBoaVista";

export const Route = createFileRoute("/servicos/manutencao-tv/boa-vista")({
  component: ManutencaoTvBoaVista,
});
