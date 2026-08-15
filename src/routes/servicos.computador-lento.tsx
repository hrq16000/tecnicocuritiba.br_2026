import { createFileRoute } from "@tanstack/react-router";
import ComputadorLento from "@/pages/servicos/ComputadorLento";

export const Route = createFileRoute("/servicos/computador-lento")({
  component: ComputadorLento,
});
