import { createFileRoute } from "@tanstack/react-router";
import Bigorrilho from "@/pages/bairros/Bigorrilho";

export const Route = createFileRoute("/bairros/bigorrilho")({
  component: Bigorrilho,
});
