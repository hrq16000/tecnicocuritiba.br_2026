import { createFileRoute } from "@tanstack/react-router";
import ConsertoNotebookPortao from "@/pages/servico-bairro/ConsertoNotebookPortao";

export const Route = createFileRoute("/servicos/conserto-pc-notebook/portao")({
  component: ConsertoNotebookPortao,
});
