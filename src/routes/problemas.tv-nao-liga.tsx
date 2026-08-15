import { createFileRoute } from "@tanstack/react-router";
import ProblemaTvNaoLiga from "@/pages/problemas/TvNaoLiga";

export const Route = createFileRoute("/problemas/tv-nao-liga")({
  component: ProblemaTvNaoLiga,
});
