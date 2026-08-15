import { createFileRoute } from "@tanstack/react-router";
import { ConsertoSomHub } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-som-curitiba")({
  component: ConsertoSomHub,
});
