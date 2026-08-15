import { createFileRoute } from "@tanstack/react-router";
import Aviacao from "@/pages/bairros/Aviacao";

export const Route = createFileRoute("/bairros/aviacao")({
  component: Aviacao,
});
