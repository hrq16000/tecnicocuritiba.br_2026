import { createFileRoute } from "@tanstack/react-router";
import CFTVPinhais from "@/pages/cftv/CFTVPinhais";

export const Route = createFileRoute("/cftv/pinhais")({
  component: CFTVPinhais,
});
