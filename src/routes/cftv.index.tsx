import { createFileRoute } from "@tanstack/react-router";
import CFTVPage from "@/pages/CFTV";

export const Route = createFileRoute("/cftv/")({
  component: CFTVPage,
});
