import { createFileRoute } from "@tanstack/react-router";
import Fazendinha from "@/pages/bairros/Fazendinha";

export const Route = createFileRoute("/bairros/fazendinha")({
  component: Fazendinha,
});
