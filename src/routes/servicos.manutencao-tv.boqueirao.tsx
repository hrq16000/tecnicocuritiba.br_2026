import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvBoqueirao from "@/pages/servico-bairro/ManutencaoTvBoqueirao";

export const Route = createFileRoute("/servicos/manutencao-tv/boqueirao")({
  component: ManutencaoTvBoqueirao,
});
