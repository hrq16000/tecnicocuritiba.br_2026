import { createFileRoute } from "@tanstack/react-router";
import Avaliar from "@/pages/Avaliar";

export const Route = createFileRoute("/avaliar")({
  component: Avaliar,
});
