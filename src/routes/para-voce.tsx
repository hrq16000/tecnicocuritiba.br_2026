import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/para-voce")({
  beforeLoad: () => {
    throw redirect({ to: "/atendimento-domicilio", statusCode: 301 });
  },
});
