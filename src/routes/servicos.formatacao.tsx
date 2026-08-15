import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/formatacao")({
  component: () => <ServicoCore slug="formatacao" />,
});
