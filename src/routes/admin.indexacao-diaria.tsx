import { createFileRoute } from "@tanstack/react-router";
import AdminIndexDaily from "@/pages/admin/AdminIndexDaily";

export const Route = createFileRoute("/admin/indexacao-diaria")({
  component: AdminIndexDaily,
});
