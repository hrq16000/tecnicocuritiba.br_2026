import { createFileRoute } from "@tanstack/react-router";
import AdminVitals from "@/pages/admin/AdminVitals";

export const Route = createFileRoute("/admin/vitals")({
  component: AdminVitals,
});
