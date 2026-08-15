import { createFileRoute } from "@tanstack/react-router";
import ConsertoNotebookCIC from "@/pages/servico-bairro/ConsertoNotebookCIC";

export const Route = createFileRoute("/servicos/conserto-pc-notebook/cic")({
  component: ConsertoNotebookCIC,
});
