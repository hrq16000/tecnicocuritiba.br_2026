import { createFileRoute } from "@tanstack/react-router";
import JardimAmericas from "@/pages/bairros/JardimAmericas";

export const Route = createFileRoute("/bairros/jardim-das-americas")({
  component: JardimAmericas,
});
