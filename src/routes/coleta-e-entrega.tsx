import { createFileRoute } from "@tanstack/react-router";
import ColetaEntrega from "@/pages/ColetaEntrega";

export const Route = createFileRoute("/coleta-e-entrega")({
  component: ColetaEntrega,
});
