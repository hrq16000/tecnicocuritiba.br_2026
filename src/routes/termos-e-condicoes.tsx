import { createFileRoute } from "@tanstack/react-router";
import TermosCondicoes from "@/pages/TermosCondicoes";

export const Route = createFileRoute("/termos-e-condicoes")({
  component: TermosCondicoes,
});
