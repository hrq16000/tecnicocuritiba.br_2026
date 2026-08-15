import { createFileRoute } from "@tanstack/react-router";
import AdminProvasVerticais from "@/pages/admin/AdminProvasVerticais";

export const Route = createFileRoute("/admin/provas-verticais")({
  component: AdminProvasVerticais,
});
