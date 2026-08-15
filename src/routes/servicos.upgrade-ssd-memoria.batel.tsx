import { createFileRoute } from "@tanstack/react-router";
import UpgradeSsdBatel from "@/pages/servico-bairro/UpgradeSsdBatel";

export const Route = createFileRoute("/servicos/upgrade-ssd-memoria/batel")({
  component: UpgradeSsdBatel,
});
