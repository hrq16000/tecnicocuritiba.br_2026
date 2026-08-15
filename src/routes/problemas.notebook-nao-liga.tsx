import { createFileRoute } from "@tanstack/react-router";
import NotebookNaoLiga from "@/pages/problemas/NotebookNaoLiga";

export const Route = createFileRoute("/problemas/notebook-nao-liga")({
  component: NotebookNaoLiga,
});
