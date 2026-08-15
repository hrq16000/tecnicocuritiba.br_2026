import { createFileRoute } from "@tanstack/react-router";
import ProblemaComputadorLento from "@/pages/problemas/ComputadorLento";

export const Route = createFileRoute("/problemas/computador-lento")({
  component: ProblemaComputadorLento,
});
