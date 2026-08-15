import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/suporte-tecnico-remoto")({
  beforeLoad: () => {
    throw redirect({ to: "/atendimento-remoto", statusCode: 301 });
  },
});
