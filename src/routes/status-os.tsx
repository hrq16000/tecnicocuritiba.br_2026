import { createFileRoute } from "@tanstack/react-router";
import StatusOs from "@/pages/StatusOs";

export const Route = createFileRoute("/status-os")({
  component: StatusOs,
});
