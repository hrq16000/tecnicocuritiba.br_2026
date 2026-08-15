import { createFileRoute } from "@tanstack/react-router";
import AraucariaCentro from "@/pages/bairros/AraucariaCentro";

export const Route = createFileRoute("/bairros/centro-araucaria")({
  component: AraucariaCentro,
});
