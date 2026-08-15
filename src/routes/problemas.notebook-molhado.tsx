import { createFileRoute } from "@tanstack/react-router";
import ProblemaNotebookMolhado from "@/pages/problemas/NotebookMolhado";

export const Route = createFileRoute("/problemas/notebook-molhado")({
  component: ProblemaNotebookMolhado,
});
