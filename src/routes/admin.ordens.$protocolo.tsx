import { createFileRoute } from "@tanstack/react-router";
import AdminOrdemDetalhe from "@/pages/admin/AdminOrdemDetalhe";

export const Route = createFileRoute("/admin/ordens/$protocolo")({
  head: () => ({
    meta: [
      { title: "Ordem de serviço — painel interno" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOrdemDetalhe,
});
