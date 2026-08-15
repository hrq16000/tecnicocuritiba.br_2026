import { createFileRoute } from "@tanstack/react-router";
import CentroFRG from "@/pages/bairros/CentroFRG";

export const Route = createFileRoute("/bairros/centro-fazenda-rio-grande")({
  component: CentroFRG,
});
