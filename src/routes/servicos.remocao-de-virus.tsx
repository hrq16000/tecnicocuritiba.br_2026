import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/remocao-de-virus")({
  component: () => <ServicoCore slug="remocao-de-virus" />,
});
