import { createFileRoute } from "@tanstack/react-router";
import CapelaVelhaAraucaria from "@/pages/bairros/CapelaVelhaAraucaria";

export const Route = createFileRoute("/bairros/capela-velha")({
  component: CapelaVelhaAraucaria,
});
