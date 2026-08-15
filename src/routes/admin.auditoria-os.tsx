import { createFileRoute } from "@tanstack/react-router";
import AdminOsAudit from "@/pages/admin/AdminOsAudit";

export const Route = createFileRoute("/admin/auditoria-os")({
  component: AdminOsAudit,
});
