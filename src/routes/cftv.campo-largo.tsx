import { createFileRoute } from "@tanstack/react-router";
import CFTVCampoLargo from "@/pages/cftv/CFTVCampoLargo";

export const Route = createFileRoute("/cftv/campo-largo")({
  component: CFTVCampoLargo,
});
