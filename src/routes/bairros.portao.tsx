import { createFileRoute } from "@tanstack/react-router";
import Portao from "@/pages/bairros/Portao";

export const Route = createFileRoute("/bairros/portao")({
  component: Portao,
});
