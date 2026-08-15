import { createFileRoute } from "@tanstack/react-router";
import ProblemaImpressoraNaoImprime from "@/pages/problemas/ImpressoraNaoImprime";

export const Route = createFileRoute("/problemas/impressora-nao-imprime")({
  component: ProblemaImpressoraNaoImprime,
});
