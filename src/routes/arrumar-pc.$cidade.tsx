import { createFileRoute } from "@tanstack/react-router";
import ArrumarPCCity from "@/pages/arrumar-pc/ArrumarPCCity";

export const Route = createFileRoute("/arrumar-pc/$cidade")({
  component: ArrumarPCCity,
});
