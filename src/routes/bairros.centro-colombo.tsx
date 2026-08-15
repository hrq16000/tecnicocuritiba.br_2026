import { createFileRoute } from "@tanstack/react-router";
import CentroColombo from "@/pages/bairros/CentroColombo";

export const Route = createFileRoute("/bairros/centro-colombo")({
  component: CentroColombo,
});
