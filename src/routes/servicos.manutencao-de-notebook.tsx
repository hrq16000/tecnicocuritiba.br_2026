import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/manutencao-de-notebook")({
  component: () => <ServicoCore slug="manutencao-de-notebook" />,
});
