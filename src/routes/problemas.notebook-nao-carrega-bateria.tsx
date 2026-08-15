import { createFileRoute } from "@tanstack/react-router";
import ProblemaNotebookNaoCarregaBateria from "@/pages/problemas/NotebookNaoCarregaBateria";

export const Route = createFileRoute("/problemas/notebook-nao-carrega-bateria")({
  component: ProblemaNotebookNaoCarregaBateria,
});
