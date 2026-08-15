import { createFileRoute } from "@tanstack/react-router";
import RedesWifiCampoLargo from "@/pages/servico-bairro/RedesWifiCampoLargo";

export const Route = createFileRoute("/servicos/redes-wifi/campo-largo")({
  component: RedesWifiCampoLargo,
});
