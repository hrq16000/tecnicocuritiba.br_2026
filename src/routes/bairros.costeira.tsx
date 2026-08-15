import { createFileRoute } from "@tanstack/react-router";
import Costeira from "@/pages/bairros/Costeira";

export const Route = createFileRoute("/bairros/costeira")({
  component: Costeira,
});
