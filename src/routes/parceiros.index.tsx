import { createFileRoute } from "@tanstack/react-router";
import ParceirosHub from "@/pages/parceiros/ParceirosHub";

export const Route = createFileRoute("/parceiros/")({
  component: ParceirosHub,
});
