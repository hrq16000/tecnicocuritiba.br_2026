import { createFileRoute } from "@tanstack/react-router";
import RedesWifiCIC from "@/pages/servico-bairro/RedesWifiCIC";

export const Route = createFileRoute("/servicos/redes-wifi/cic")({
  component: RedesWifiCIC,
});
