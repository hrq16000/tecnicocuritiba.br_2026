import { createFileRoute } from "@tanstack/react-router";
import ParqueDaFonte from "@/pages/bairros/ParqueDaFonte";

export const Route = createFileRoute("/bairros/parque-da-fonte")({
  component: ParqueDaFonte,
});
