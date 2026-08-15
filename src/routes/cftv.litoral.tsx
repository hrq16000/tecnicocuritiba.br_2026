import { createFileRoute } from "@tanstack/react-router";
import CFTVLitoral from "@/pages/cftv/CFTVLitoral";

export const Route = createFileRoute("/cftv/litoral")({
  component: CFTVLitoral,
});
