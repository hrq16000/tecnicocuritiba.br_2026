import { createFileRoute } from "@tanstack/react-router";
import ProblemaTvSemSom from "@/pages/problemas/TvSemSom";

export const Route = createFileRoute("/problemas/tv-sem-som")({
  component: ProblemaTvSemSom,
});
