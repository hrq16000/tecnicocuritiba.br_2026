import { createFileRoute } from "@tanstack/react-router";
import ProblemaNotebookNaoConectaWifi from "@/pages/problemas/NotebookNaoConectaWifi";

export const Route = createFileRoute("/problemas/notebook-nao-conecta-no-wifi")({
  component: ProblemaNotebookNaoConectaWifi,
});
