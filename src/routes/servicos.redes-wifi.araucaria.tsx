import { createFileRoute } from "@tanstack/react-router";
import RedesWifiAraucaria from "@/pages/servico-bairro/RedesWifiAraucaria";

export const Route = createFileRoute("/servicos/redes-wifi/araucaria")({
  component: RedesWifiAraucaria,
});
