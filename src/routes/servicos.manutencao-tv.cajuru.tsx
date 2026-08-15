import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvCajuru from "@/pages/servico-bairro/ManutencaoTvCajuru";

export const Route = createFileRoute("/servicos/manutencao-tv/cajuru")({
  component: ManutencaoTvCajuru,
});
