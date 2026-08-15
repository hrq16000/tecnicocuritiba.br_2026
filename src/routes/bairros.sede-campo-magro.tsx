import { createFileRoute } from "@tanstack/react-router";
import SedeCampoMagro from "@/pages/bairros/SedeCampoMagro";

export const Route = createFileRoute("/bairros/sede-campo-magro")({
  component: SedeCampoMagro,
});
