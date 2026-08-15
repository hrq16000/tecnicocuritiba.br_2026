import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/residencial")({
  beforeLoad: () => {
    throw redirect({ to: "/atendimento-domicilio", statusCode: 301 });
  },
});
