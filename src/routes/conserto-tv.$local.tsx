import { createFileRoute } from "@tanstack/react-router";
import { ConsertoTVCity } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-tv/$local")({
  component: ConsertoTVCity,
});
