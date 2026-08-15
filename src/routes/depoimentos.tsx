import { createFileRoute } from "@tanstack/react-router";
import Depoimentos from "@/pages/Depoimentos";

export const Route = createFileRoute("/depoimentos")({
  component: Depoimentos,
});
