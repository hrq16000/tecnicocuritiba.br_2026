import { createFileRoute } from "@tanstack/react-router";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/backup-para-empresas")({
  component: () => <ServicoCore slug="backup-para-empresas" />,
});
