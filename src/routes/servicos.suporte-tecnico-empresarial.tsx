import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/suporte-tecnico-empresarial")({
  component: () => <ServicoCore slug="suporte-tecnico-empresarial" />,
});
