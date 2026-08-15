import { createFileRoute } from "@tanstack/react-router";
import AdminOperacao from "@/pages/admin/AdminOperacao";

export const Route = createFileRoute("/admin/operacao")({
  component: AdminOperacao,
});
