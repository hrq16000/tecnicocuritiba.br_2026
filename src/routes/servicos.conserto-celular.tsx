import { createFileRoute } from "@tanstack/react-router";
import ConsertoCelular from "@/pages/servicos/ConsertoCelular";

export const Route = createFileRoute("/servicos/conserto-celular")({
  component: ConsertoCelular,
});
