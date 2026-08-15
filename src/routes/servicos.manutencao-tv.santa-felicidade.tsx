import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTvSantaFelicidade from "@/pages/servico-bairro/ManutencaoTvSantaFelicidade";

export const Route = createFileRoute("/servicos/manutencao-tv/santa-felicidade")({
  component: ManutencaoTvSantaFelicidade,
});
