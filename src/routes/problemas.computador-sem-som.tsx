import { createFileRoute } from "@tanstack/react-router";
import ProblemaComputadorSemSom from "@/pages/problemas/ComputadorSemSom";

export const Route = createFileRoute("/problemas/computador-sem-som")({
  component: ProblemaComputadorSemSom,
});
