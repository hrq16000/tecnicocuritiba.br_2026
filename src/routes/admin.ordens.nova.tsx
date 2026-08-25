import { createFileRoute } from "@tanstack/react-router";
import AdminOrdemNova from "@/pages/admin/AdminOrdemNova";

export const Route = createFileRoute("/admin/ordens/nova")({
  head: () => ({
    meta: [
      { title: "Nova ordem de serviço — painel interno" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOrdemNova,
});
