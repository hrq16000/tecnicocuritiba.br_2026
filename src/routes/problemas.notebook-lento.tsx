import { createFileRoute } from "@tanstack/react-router";
import ProblemaNotebookLento from "@/pages/problemas/NotebookLento";

export const Route = createFileRoute("/problemas/notebook-lento")({
  component: ProblemaNotebookLento,
});
