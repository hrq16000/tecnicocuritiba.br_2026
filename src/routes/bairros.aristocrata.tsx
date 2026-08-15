import { createFileRoute } from "@tanstack/react-router";
import Aristocrata from "@/pages/bairros/Aristocrata";

export const Route = createFileRoute("/bairros/aristocrata")({
  component: Aristocrata,
});
