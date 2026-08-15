import { createFileRoute } from "@tanstack/react-router";
import Braga from "@/pages/bairros/Braga";

export const Route = createFileRoute("/bairros/braga")({
  component: Braga,
});
