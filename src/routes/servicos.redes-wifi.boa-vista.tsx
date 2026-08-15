import { createFileRoute } from "@tanstack/react-router";
import RedesWifiBoaVista from "@/pages/servico-bairro/RedesWifiBoaVista";

export const Route = createFileRoute("/servicos/redes-wifi/boa-vista")({
  component: RedesWifiBoaVista,
});
