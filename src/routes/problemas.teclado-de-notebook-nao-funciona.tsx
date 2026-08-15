import { createFileRoute } from "@tanstack/react-router";
import ProblemaTecladoNotebook from "@/pages/problemas/TecladoNotebookNaoFunciona";

export const Route = createFileRoute("/problemas/teclado-de-notebook-nao-funciona")({
  component: ProblemaTecladoNotebook,
});
