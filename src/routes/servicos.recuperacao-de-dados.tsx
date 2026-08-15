import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/recuperacao-de-dados")({
  component: () => <ServicoCore slug="recuperacao-de-dados" />,
});
