import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tecnico-a-domicilio")({
  beforeLoad: () => {
    throw redirect({ to: "/atendimento-domicilio", statusCode: 301 });
  },
});
