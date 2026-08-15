import { createFileRoute } from "@tanstack/react-router";
import RondinhaCL from "@/pages/bairros/RondinhaCL";

export const Route = createFileRoute("/bairros/rondinha")({
  component: RondinhaCL,
});
