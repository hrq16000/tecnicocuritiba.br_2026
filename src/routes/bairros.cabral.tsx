import { createFileRoute } from "@tanstack/react-router";
import Cabral from "@/pages/bairros/Cabral";

export const Route = createFileRoute("/bairros/cabral")({
  component: Cabral,
});
