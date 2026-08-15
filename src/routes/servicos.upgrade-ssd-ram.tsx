import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/upgrade-ssd-ram")({
  component: () => <ServicoCore slug="upgrade-ssd-ram" />,
});
