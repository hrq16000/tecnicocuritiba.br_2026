import { createFileRoute } from "@tanstack/react-router";
import Hauer from "@/pages/bairros/Hauer";

export const Route = createFileRoute("/bairros/hauer")({
  component: Hauer,
});
