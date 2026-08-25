import { createFileRoute } from "@tanstack/react-router";
import AtubaCuritiba from "@/pages/bairros/AtubaCuritiba";

export const Route = createFileRoute("/bairros/atuba")({
  component: AtubaCuritiba,
});
