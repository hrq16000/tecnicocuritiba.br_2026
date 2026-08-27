import { createFileRoute } from "@tanstack/react-router";
import AdminSeoStatus from "@/pages/admin/AdminSeoStatus";

export const Route = createFileRoute("/admin/seo-status")({
  component: AdminSeoStatus,
});
