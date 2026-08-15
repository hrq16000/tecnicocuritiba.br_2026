import { createFileRoute } from "@tanstack/react-router";
import BateiasCL from "@/pages/bairros/BateiasCL";

export const Route = createFileRoute("/bairros/bateias")({
  component: BateiasCL,
});
