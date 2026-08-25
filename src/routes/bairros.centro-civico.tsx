import { createFileRoute } from "@tanstack/react-router";
import CentroCivico from "@/pages/bairros/CentroCivico";

export const Route = createFileRoute("/bairros/centro-civico")({
  component: CentroCivico,
});
