import { createFileRoute } from "@tanstack/react-router";
import ProblemaTvLinhas from "@/pages/problemas/TvComLinhasNaTela";

export const Route = createFileRoute("/problemas/tv-com-linhas-na-tela")({
  component: ProblemaTvLinhas,
});
