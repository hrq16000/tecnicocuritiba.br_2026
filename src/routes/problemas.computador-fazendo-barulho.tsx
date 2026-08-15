import { createFileRoute } from "@tanstack/react-router";
import ProblemaComputadorBarulho from "@/pages/problemas/ComputadorFazendoBarulho";

export const Route = createFileRoute("/problemas/computador-fazendo-barulho")({
  component: ProblemaComputadorBarulho,
});
