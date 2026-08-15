import { createFileRoute } from "@tanstack/react-router";
import SejaParceiro from "@/pages/SejaParceiro";

export const Route = createFileRoute("/seja-parceiro")({
  component: SejaParceiro,
});
