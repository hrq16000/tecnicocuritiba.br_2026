import { createFileRoute } from "@tanstack/react-router";
import CFTVGuaratuba from "@/pages/cftv/CFTVGuaratuba";

export const Route = createFileRoute("/cftv/guaratuba")({
  component: CFTVGuaratuba,
});
