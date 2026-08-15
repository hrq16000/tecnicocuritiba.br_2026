import { createFileRoute } from "@tanstack/react-router";
import Centro from "@/pages/bairros/Centro";

export const Route = createFileRoute("/bairros/centro")({
  component: Centro,
});
