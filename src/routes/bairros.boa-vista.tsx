import { createFileRoute } from "@tanstack/react-router";
import BoaVista from "@/pages/bairros/BoaVista";

export const Route = createFileRoute("/bairros/boa-vista")({
  component: BoaVista,
});
