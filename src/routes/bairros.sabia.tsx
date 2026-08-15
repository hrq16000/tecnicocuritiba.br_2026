import { createFileRoute } from "@tanstack/react-router";
import SabiaAraucaria from "@/pages/bairros/SabiaAraucaria";

export const Route = createFileRoute("/bairros/sabia")({
  component: SabiaAraucaria,
});
