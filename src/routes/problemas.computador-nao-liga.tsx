import { createFileRoute } from "@tanstack/react-router";
import ProblemaComputadorNaoLiga from "@/pages/problemas/ComputadorNaoLiga";

export const Route = createFileRoute("/problemas/computador-nao-liga")({
  component: ProblemaComputadorNaoLiga,
});
