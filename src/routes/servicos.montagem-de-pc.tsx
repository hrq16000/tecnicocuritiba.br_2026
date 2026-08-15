import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/montagem-de-pc")({
  component: () => <ServicoCore slug="montagem-de-pc" />,
});
