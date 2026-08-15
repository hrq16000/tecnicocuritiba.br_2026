import { createFileRoute } from "@tanstack/react-router";
import ItaliaSJP from "@/pages/bairros/ItaliaSJP";

export const Route = createFileRoute("/bairros/italia-sjp")({
  component: ItaliaSJP,
});
