import { createFileRoute } from "@tanstack/react-router";
import ArrumarPCServicoCidade from "@/pages/arrumar-pc/ArrumarPCServicoCidade";

export const Route = createFileRoute("/arrumar-pc/servico/$servico/$cidade")({
  component: ArrumarPCServicoCidade,
});
