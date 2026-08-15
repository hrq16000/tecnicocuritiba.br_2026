import { createFileRoute } from "@tanstack/react-router";
import { ConsertoSomCity } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-som/$local")({
  component: ConsertoSomCity,
});
