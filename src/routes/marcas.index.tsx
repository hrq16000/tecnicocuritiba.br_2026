import { createFileRoute } from "@tanstack/react-router";
import Marcas from "@/pages/Marcas";

export const Route = createFileRoute("/marcas/")({
  component: Marcas,
});
