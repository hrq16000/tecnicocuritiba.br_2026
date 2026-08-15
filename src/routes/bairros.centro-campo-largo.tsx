import { createFileRoute } from "@tanstack/react-router";
import CampoLargoCentro from "@/pages/bairros/CampoLargoCentro";

export const Route = createFileRoute("/bairros/centro-campo-largo")({
  component: CampoLargoCentro,
});
