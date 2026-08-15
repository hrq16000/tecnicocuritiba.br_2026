import { createFileRoute } from "@tanstack/react-router";
import Empresas from "@/pages/Empresas";

export const Route = createFileRoute("/empresas")({
  component: Empresas,
});
