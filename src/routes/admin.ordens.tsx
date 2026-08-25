import { createFileRoute } from "@tanstack/react-router";
import AdminOrdens from "@/pages/admin/AdminOrdens";

export const Route = createFileRoute("/admin/ordens")({
  head: () => ({
    meta: [
      { title: "Ordens de serviço — painel interno" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOrdens,
});
