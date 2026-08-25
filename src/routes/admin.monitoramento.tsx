import { createFileRoute } from "@tanstack/react-router";
import AdminMonitoramento from "@/pages/admin/AdminMonitoramento";

export const Route = createFileRoute("/admin/monitoramento")({
  component: AdminMonitoramento,
  head: () => ({
    meta: [
      { title: "Monitoramento operacional D0–D30 | interno" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Painel interno de acompanhamento de indexação por marco operacional." },
    ],
  }),
});
