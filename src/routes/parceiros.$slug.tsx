import { createFileRoute } from "@tanstack/react-router";
import ParceiroPage from "@/pages/parceiros/ParceiroPage";

export const Route = createFileRoute("/parceiros/$slug")({
  component: ParceiroPage,
});
