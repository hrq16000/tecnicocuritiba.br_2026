import { createFileRoute } from "@tanstack/react-router";
import AdminIndexStatus from "@/pages/admin/AdminIndexStatus";

export const Route = createFileRoute("/admin/indexacao")({
  component: AdminIndexStatus,
});
