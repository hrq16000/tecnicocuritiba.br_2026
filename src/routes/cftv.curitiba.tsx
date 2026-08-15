import { createFileRoute } from "@tanstack/react-router";
import CFTVCuritiba from "@/pages/cftv/CFTVCuritiba";

export const Route = createFileRoute("/cftv/curitiba")({
  component: CFTVCuritiba,
});
