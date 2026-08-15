import { createFileRoute } from "@tanstack/react-router";
import ProblemaComputadorDesligaSozinho from "@/pages/problemas/ComputadorDesligaSozinho";

export const Route = createFileRoute("/problemas/computador-desliga-sozinho")({
  component: ProblemaComputadorDesligaSozinho,
});
