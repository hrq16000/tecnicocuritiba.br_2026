import { createFileRoute } from "@tanstack/react-router";
import ArrumarPC from "@/pages/ArrumarPC";

export const Route = createFileRoute("/arrumar-pc/online")({
  component: ArrumarPC,
});
