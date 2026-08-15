import { createFileRoute } from "@tanstack/react-router";
import UpgradeSsdPinhais from "@/pages/servico-bairro/UpgradeSsdPinhais";

export const Route = createFileRoute("/servicos/upgrade-ssd-memoria/pinhais")({
  component: UpgradeSsdPinhais,
});
