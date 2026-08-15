import { createFileRoute } from "@tanstack/react-router";
import MontagemPcCIC from "@/pages/servico-bairro/MontagemPcCIC";

export const Route = createFileRoute("/servicos/montagem-pc/cic")({
  component: MontagemPcCIC,
});
