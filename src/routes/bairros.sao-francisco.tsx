import { createFileRoute } from "@tanstack/react-router";
import SaoFrancisco from "@/pages/bairros/SaoFrancisco";

export const Route = createFileRoute("/bairros/sao-francisco")({
  component: SaoFrancisco,
});
