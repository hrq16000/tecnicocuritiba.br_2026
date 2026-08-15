import { createFileRoute } from "@tanstack/react-router";
import CIC from "@/pages/bairros/CIC";

export const Route = createFileRoute("/bairros/cic")({
  component: CIC,
});
