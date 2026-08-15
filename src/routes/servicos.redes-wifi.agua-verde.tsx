import { createFileRoute } from "@tanstack/react-router";
import RedesWifiAguaVerde from "@/pages/servico-bairro/RedesWifiAguaVerde";

export const Route = createFileRoute("/servicos/redes-wifi/agua-verde")({
  component: RedesWifiAguaVerde,
});
