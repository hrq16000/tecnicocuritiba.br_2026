import { createFileRoute } from "@tanstack/react-router";
import PassaunaAraucaria from "@/pages/bairros/PassaunaAraucaria";

export const Route = createFileRoute("/bairros/passauna")({
  component: PassaunaAraucaria,
});
