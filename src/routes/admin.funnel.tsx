import { createFileRoute } from "@tanstack/react-router";
import AdminFunnel from "@/pages/admin/AdminFunnel";

export const Route = createFileRoute("/admin/funnel")({
  component: AdminFunnel,
});
