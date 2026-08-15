import { createFileRoute } from "@tanstack/react-router";
import Merces from "@/pages/bairros/Merces";

export const Route = createFileRoute("/bairros/merces")({
  component: Merces,
});
