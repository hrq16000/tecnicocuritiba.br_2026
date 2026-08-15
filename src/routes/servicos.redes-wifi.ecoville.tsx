import { createFileRoute } from "@tanstack/react-router";
import RedesWifiEcoville from "@/pages/servico-bairro/RedesWifiEcoville";

export const Route = createFileRoute("/servicos/redes-wifi/ecoville")({
  component: RedesWifiEcoville,
});
