import { createFileRoute } from "@tanstack/react-router";
import UpgradeSsdAraucaria from "@/pages/servico-bairro/UpgradeSsdAraucaria";

export const Route = createFileRoute("/servicos/upgrade-ssd-memoria/araucaria")({
  component: UpgradeSsdAraucaria,
});
