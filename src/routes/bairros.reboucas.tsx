import { createFileRoute } from "@tanstack/react-router";
import Reboucas from "@/pages/bairros/Reboucas";

export const Route = createFileRoute("/bairros/reboucas")({
  component: Reboucas,
});
