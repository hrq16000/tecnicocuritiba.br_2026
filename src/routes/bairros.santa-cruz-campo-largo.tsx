import { createFileRoute } from "@tanstack/react-router";
import SantaCruzCL from "@/pages/bairros/SantaCruzCL";

export const Route = createFileRoute("/bairros/santa-cruz-campo-largo")({
  component: SantaCruzCL,
});
