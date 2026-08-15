import { createFileRoute } from "@tanstack/react-router";
import PortoDasLaranjeiras from "@/pages/bairros/PortoDasLaranjeiras";

export const Route = createFileRoute("/bairros/porto-das-laranjeiras")({
  component: PortoDasLaranjeiras,
});
