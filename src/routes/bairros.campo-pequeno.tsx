import { createFileRoute } from "@tanstack/react-router";
import CampoPequenoColombo from "@/pages/bairros/CampoPequenoColombo";

export const Route = createFileRoute("/bairros/campo-pequeno")({
  component: CampoPequenoColombo,
});
