import { createFileRoute } from "@tanstack/react-router";
import RedesWifiSaoJosePinhais from "@/pages/servico-bairro/RedesWifiSaoJosePinhais";

export const Route = createFileRoute("/servicos/redes-wifi/sao-jose-dos-pinhais")({
  component: RedesWifiSaoJosePinhais,
});
