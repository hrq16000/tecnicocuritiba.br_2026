import { createFileRoute } from "@tanstack/react-router";
import ProblemasHub from "@/pages/problemas/ProblemasHub";

export const Route = createFileRoute("/problemas/")({
  component: ProblemasHub,
});
