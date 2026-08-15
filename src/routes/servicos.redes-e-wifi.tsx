import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/redes-e-wifi")({
  component: () => <ServicoCore slug="redes-e-wifi" />,
});
