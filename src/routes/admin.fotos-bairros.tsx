import { createFileRoute } from "@tanstack/react-router";
import AdminFotosBairros from "@/pages/admin/AdminFotosBairros";

export const Route = createFileRoute("/admin/fotos-bairros")({
  component: AdminFotosBairros,
});
