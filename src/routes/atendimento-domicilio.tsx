import { createFileRoute } from "@tanstack/react-router";
import AtendimentoDomicilio from "@/pages/AtendimentoDomicilio";

export const Route = createFileRoute("/atendimento-domicilio")({
  component: AtendimentoDomicilio,
});
