import { createFileRoute } from "@tanstack/react-router";
import RedesWifiCajuru from "@/pages/servico-bairro/RedesWifiCajuru";

export const Route = createFileRoute("/servicos/redes-wifi/cajuru")({
  component: RedesWifiCajuru,
});
