import { createFileRoute } from "@tanstack/react-router";
import Cruzeiro from "@/pages/bairros/Cruzeiro";

export const Route = createFileRoute("/bairros/cruzeiro")({
  component: Cruzeiro,
});
