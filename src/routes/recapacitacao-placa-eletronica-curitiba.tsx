import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/recapacitacao-placa-eletronica-curitiba")({
  beforeLoad: () => {
    throw redirect({ href: "/procedimentos/recapacitacao-placa-eletronica-curitiba", statusCode: 301 });
  },
});
