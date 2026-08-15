import { createFileRoute } from "@tanstack/react-router";
import AdminPublishStatus from "@/pages/admin/AdminPublishStatus";

export const Route = createFileRoute("/admin/publicacao")({
  component: AdminPublishStatus,
});
