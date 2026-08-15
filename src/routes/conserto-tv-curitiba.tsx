import { createFileRoute } from "@tanstack/react-router";
import { ConsertoTVHub } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-tv-curitiba")({
  component: ConsertoTVHub,
});
