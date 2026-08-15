import { createFileRoute } from "@tanstack/react-router";
import ProblemaTvTravando from "@/pages/problemas/TvTravando";

export const Route = createFileRoute("/problemas/tv-travando")({
  component: ProblemaTvTravando,
});
