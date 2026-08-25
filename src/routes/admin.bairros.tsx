import { createFileRoute } from "@tanstack/react-router";
import AdminBairros from "@/pages/admin/AdminBairros";

export const Route = createFileRoute("/admin/bairros")({
  component: AdminBairros,
});
