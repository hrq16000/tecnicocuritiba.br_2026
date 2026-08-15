import { createFileRoute } from "@tanstack/react-router";
import AdminCasos from "@/pages/admin/AdminCasos";

export const Route = createFileRoute("/admin/casos")({
  component: AdminCasos,
});
