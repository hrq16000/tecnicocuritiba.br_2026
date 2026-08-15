import { createFileRoute } from "@tanstack/react-router";
import ConsertoNotebookCampoLargo from "@/pages/servico-bairro/ConsertoNotebookCampoLargo";

export const Route = createFileRoute("/servicos/conserto-pc-notebook/campo-largo")({
  component: ConsertoNotebookCampoLargo,
});
