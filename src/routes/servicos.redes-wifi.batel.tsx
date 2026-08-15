import { createFileRoute } from "@tanstack/react-router";
import RedesWifiBatel from "@/pages/servico-bairro/RedesWifiBatel";

export const Route = createFileRoute("/servicos/redes-wifi/batel")({
  component: RedesWifiBatel,
});
