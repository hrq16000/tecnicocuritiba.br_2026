import { createFileRoute } from "@tanstack/react-router";
import SantaFelicidade from "@/pages/bairros/SantaFelicidade";

export const Route = createFileRoute("/bairros/santa-felicidade")({
  component: SantaFelicidade,
});
