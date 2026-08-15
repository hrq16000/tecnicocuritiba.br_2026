import { createFileRoute } from "@tanstack/react-router";
import AdminProvasMonitor from "@/pages/admin/AdminProvasMonitor";

export const Route = createFileRoute("/admin/provas-monitor")({
  component: AdminProvasMonitor,
});
