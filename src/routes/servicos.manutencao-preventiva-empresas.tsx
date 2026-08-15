import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/manutencao-preventiva-empresas")({
  component: () => <ServicoCore slug="manutencao-preventiva-empresas" />,
});
