import { createFileRoute } from "@tanstack/react-router";
import ProblemaTvNaoConectaWifi from "@/pages/problemas/TvNaoConectaWifi";

export const Route = createFileRoute("/problemas/tv-nao-conecta-no-wifi")({
  component: ProblemaTvNaoConectaWifi,
});
