import { createFileRoute } from "@tanstack/react-router";
import ProblemaComputadorTravando from "@/pages/problemas/ComputadorTravando";

export const Route = createFileRoute("/problemas/computador-travando")({
  component: ProblemaComputadorTravando,
});
