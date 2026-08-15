import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/conserto-tv")({
  component: () => <ServicoCore slug="conserto-tv" />,
});
