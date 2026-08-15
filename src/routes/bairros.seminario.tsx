import { createFileRoute } from "@tanstack/react-router";
import Seminario from "@/pages/bairros/Seminario";

export const Route = createFileRoute("/bairros/seminario")({
  component: Seminario,
});
