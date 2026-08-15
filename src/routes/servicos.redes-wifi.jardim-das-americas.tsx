import { createFileRoute } from "@tanstack/react-router";
import RedesWifiJardimAmericas from "@/pages/servico-bairro/RedesWifiJardimAmericas";

export const Route = createFileRoute("/servicos/redes-wifi/jardim-das-americas")({
  component: RedesWifiJardimAmericas,
});
