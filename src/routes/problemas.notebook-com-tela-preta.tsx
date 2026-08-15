import { createFileRoute } from "@tanstack/react-router";
import ProblemaNotebookTelaPreta from "@/pages/problemas/NotebookComTelaPreta";

export const Route = createFileRoute("/problemas/notebook-com-tela-preta")({
  component: ProblemaNotebookTelaPreta,
});
