import { createFileRoute } from "@tanstack/react-router";
import RedesWifiCentro from "@/pages/servico-bairro/RedesWifiCentro";

export const Route = createFileRoute("/servicos/redes-wifi/centro")({
  component: RedesWifiCentro,
});
