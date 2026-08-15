import { createFileRoute } from "@tanstack/react-router";
import ParqueNascentesPinhais from "@/pages/bairros/ParqueNascentesPinhais";

export const Route = createFileRoute("/bairros/parque-nascentes-pinhais")({
  component: ParqueNascentesPinhais,
});
