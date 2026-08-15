import { createFileRoute } from "@tanstack/react-router";
import RedesWifiPortao from "@/pages/servico-bairro/RedesWifiPortao";

export const Route = createFileRoute("/servicos/redes-wifi/portao")({
  component: RedesWifiPortao,
});
