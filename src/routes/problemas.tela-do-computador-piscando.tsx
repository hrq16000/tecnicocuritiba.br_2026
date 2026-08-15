import { createFileRoute } from "@tanstack/react-router";
import ProblemaTelaDoComputadorPiscando from "@/pages/problemas/TelaDoComputadorPiscando";

export const Route = createFileRoute("/problemas/tela-do-computador-piscando")({
  component: ProblemaTelaDoComputadorPiscando,
});
