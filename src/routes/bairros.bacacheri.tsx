import { createFileRoute } from "@tanstack/react-router";
import Bacacheri from "@/pages/bairros/Bacacheri";

export const Route = createFileRoute("/bairros/bacacheri")({
  component: Bacacheri,
});
