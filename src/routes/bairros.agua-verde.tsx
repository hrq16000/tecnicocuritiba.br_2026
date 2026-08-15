import { createFileRoute } from "@tanstack/react-router";
import AguaVerde from "@/pages/bairros/AguaVerde";

export const Route = createFileRoute("/bairros/agua-verde")({
  component: AguaVerde,
});
