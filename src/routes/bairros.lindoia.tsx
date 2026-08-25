import { createFileRoute } from "@tanstack/react-router";
import Lindoia from "@/pages/bairros/Lindoia";

export const Route = createFileRoute("/bairros/lindoia")({
  component: Lindoia,
});
