import { createFileRoute } from "@tanstack/react-router";
import WeissopolisPinhais from "@/pages/bairros/WeissopolisPinhais";

export const Route = createFileRoute("/bairros/weissopolis")({
  component: WeissopolisPinhais,
});
