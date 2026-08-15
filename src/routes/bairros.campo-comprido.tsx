import { createFileRoute } from "@tanstack/react-router";
import CampoComprido from "@/pages/bairros/CampoComprido";

export const Route = createFileRoute("/bairros/campo-comprido")({
  component: CampoComprido,
});
