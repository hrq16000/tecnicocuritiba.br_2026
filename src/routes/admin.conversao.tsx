import { createFileRoute } from "@tanstack/react-router";
import AdminConversao from "@/pages/admin/AdminConversao";

export const Route = createFileRoute("/admin/conversao")({
  component: AdminConversao,
});
