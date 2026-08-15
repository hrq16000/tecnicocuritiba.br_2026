import { createFileRoute } from "@tanstack/react-router";
import SaoDomingos from "@/pages/bairros/SaoDomingos";

export const Route = createFileRoute("/bairros/sao-domingos")({
  component: SaoDomingos,
});
