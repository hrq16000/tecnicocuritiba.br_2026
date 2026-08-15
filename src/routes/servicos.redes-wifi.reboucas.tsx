import { createFileRoute } from "@tanstack/react-router";
import RedesWifiReboucas from "@/pages/servico-bairro/RedesWifiReboucas";

export const Route = createFileRoute("/servicos/redes-wifi/reboucas")({
  component: RedesWifiReboucas,
});
