import { createFileRoute } from "@tanstack/react-router";
import RedesWifiPinhais from "@/pages/servico-bairro/RedesWifiPinhais";

export const Route = createFileRoute("/servicos/redes-wifi/pinhais")({
  component: RedesWifiPinhais,
});
