import { createFileRoute } from "@tanstack/react-router";
import AdminIndexNowStatus from "@/pages/admin/AdminIndexNowStatus";

export const Route = createFileRoute("/admin/indexnow-status")({
  head: () => ({
    meta: [
      { title: "Status do IndexNow — painel interno" },
      { name: "description", content: "Histórico de submissões IndexNow, motivos por URL e erros por execução." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Status do IndexNow — painel interno" },
      { property: "og:description", content: "Histórico de submissões IndexNow, motivos por URL e erros por execução." },
    ],
  }),
  component: AdminIndexNowStatus,
});
