import { createFileRoute } from "@tanstack/react-router";
import PinhaisCentro from "@/pages/bairros/PinhaisCentro";

export const Route = createFileRoute("/bairros/centro-pinhais")({
  component: PinhaisCentro,
});
