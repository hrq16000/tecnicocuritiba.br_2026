import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvAltoXV from "@/pages/servico-bairro/ManutencaoTvAltoXV";

export const Route = createFileRoute("/servicos/manutencao-tv/alto-da-xv")({
  component: ManutencaoTvAltoXV,
});
