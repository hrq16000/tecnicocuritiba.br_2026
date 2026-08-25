import { createFileRoute } from "@tanstack/react-router";
import BairroAlto from "@/pages/bairros/BairroAlto";

export const Route = createFileRoute("/bairros/bairro-alto")({
  component: BairroAlto,
});
