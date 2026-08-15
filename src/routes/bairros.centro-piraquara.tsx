import { createFileRoute } from "@tanstack/react-router";
import CentroPiraquara from "@/pages/bairros/CentroPiraquara";

export const Route = createFileRoute("/bairros/centro-piraquara")({
  component: CentroPiraquara,
});
