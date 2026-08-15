import { createFileRoute } from "@tanstack/react-router";
import NovoMundo from "@/pages/bairros/NovoMundo";

export const Route = createFileRoute("/bairros/novo-mundo")({
  component: NovoMundo,
});
