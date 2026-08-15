import { createFileRoute } from "@tanstack/react-router";
import ServicoCidadePage from "@/pages/servico-bairro/ServicoBairroGerado";

export const Route = createFileRoute("/servicos/$servico/$cidade")({
  component: ServicoCidadePage,
});
