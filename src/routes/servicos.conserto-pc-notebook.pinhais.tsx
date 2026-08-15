import { createFileRoute } from "@tanstack/react-router";
import ConsertoNotebookPinhais from "@/pages/servico-bairro/ConsertoNotebookPinhais";

export const Route = createFileRoute("/servicos/conserto-pc-notebook/pinhais")({
  component: ConsertoNotebookPinhais,
});
