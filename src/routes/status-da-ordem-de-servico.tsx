import { createFileRoute } from "@tanstack/react-router";
import StatusOs from "@/pages/StatusOs";

export const Route = createFileRoute("/status-da-ordem-de-servico")({
  component: StatusOs,
});
