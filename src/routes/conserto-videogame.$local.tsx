import { createFileRoute } from "@tanstack/react-router";
import { ConsertoVideogameCity } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-videogame/$local")({
  component: ConsertoVideogameCity,
});
