import { createFileRoute } from "@tanstack/react-router";
import { ConsertoCelularLocalCity } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-celular/$local")({
  component: ConsertoCelularLocalCity,
});
