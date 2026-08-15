import { createFileRoute } from "@tanstack/react-router";
import ConsertoNotebookBatel from "@/pages/servico-bairro/ConsertoNotebookBatel";

export const Route = createFileRoute("/servicos/conserto-pc-notebook/batel")({
  component: ConsertoNotebookBatel,
});
