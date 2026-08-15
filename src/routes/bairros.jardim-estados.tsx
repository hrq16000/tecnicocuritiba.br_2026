import { createFileRoute } from "@tanstack/react-router";
import JardimEstadosFRG from "@/pages/bairros/JardimEstadosFRG";

export const Route = createFileRoute("/bairros/jardim-estados")({
  component: JardimEstadosFRG,
});
