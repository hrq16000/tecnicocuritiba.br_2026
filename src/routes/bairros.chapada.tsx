import { createFileRoute } from "@tanstack/react-router";
import ChapadaAraucaria from "@/pages/bairros/ChapadaAraucaria";

export const Route = createFileRoute("/bairros/chapada")({
  component: ChapadaAraucaria,
});
