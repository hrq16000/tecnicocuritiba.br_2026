import { createFileRoute } from "@tanstack/react-router";
import ProblemaHdNaoReconhecido from "@/pages/problemas/HdNaoReconhecido";

export const Route = createFileRoute("/problemas/hd-nao-reconhecido")({
  component: ProblemaHdNaoReconhecido,
});
