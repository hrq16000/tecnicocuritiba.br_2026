import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pessoa-fisica")({
  beforeLoad: () => {
    throw redirect({ to: "/atendimento-domicilio", statusCode: 301 });
  },
});
