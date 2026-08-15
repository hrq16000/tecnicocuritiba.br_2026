import { createFileRoute } from "@tanstack/react-router";
import RedesWifiCabral from "@/pages/servico-bairro/RedesWifiCabral";

export const Route = createFileRoute("/servicos/redes-wifi/cabral")({
  component: RedesWifiCabral,
});
