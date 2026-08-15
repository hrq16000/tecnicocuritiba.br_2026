import { createFileRoute } from "@tanstack/react-router";
import CFTVAraucaria from "@/pages/cftv/CFTVAraucaria";

export const Route = createFileRoute("/cftv/araucaria")({
  component: CFTVAraucaria,
});
