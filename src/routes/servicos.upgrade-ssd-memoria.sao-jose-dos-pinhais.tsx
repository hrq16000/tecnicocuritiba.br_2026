import { createFileRoute } from "@tanstack/react-router";
import UpgradeSsdSaoJosePinhais from "@/pages/servico-bairro/UpgradeSsdSaoJosePinhais";

export const Route = createFileRoute("/servicos/upgrade-ssd-memoria/sao-jose-dos-pinhais")({
  component: UpgradeSsdSaoJosePinhais,
});
