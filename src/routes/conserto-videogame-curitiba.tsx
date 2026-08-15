import { createFileRoute } from "@tanstack/react-router";
import { ConsertoVideogameHub } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-videogame-curitiba")({
  component: ConsertoVideogameHub,
});
