import { createFileRoute } from "@tanstack/react-router";
import ManutencaoTV from "@/pages/servicos/ManutencaoTV";

export const Route = createFileRoute("/servicos/manutencao-tv/")({
  component: ManutencaoTV,
});
