import { createFileRoute } from "@tanstack/react-router";
import SaoMarcos from "@/pages/bairros/SaoMarcos";

export const Route = createFileRoute("/bairros/sao-marcos")({
  component: SaoMarcos,
});
