import { createFileRoute } from "@tanstack/react-router";
import QuandoNaoCompensa from "@/pages/QuandoNaoCompensa";

export const Route = createFileRoute("/quando-nao-compensa")({
  component: QuandoNaoCompensa,
});
