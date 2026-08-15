import { createFileRoute } from "@tanstack/react-router";
import ProblemaTelaNotebookQuebrada from "@/pages/problemas/TelaDeNotebookQuebrada";

export const Route = createFileRoute("/problemas/tela-de-notebook-quebrada")({
  component: ProblemaTelaNotebookQuebrada,
});
