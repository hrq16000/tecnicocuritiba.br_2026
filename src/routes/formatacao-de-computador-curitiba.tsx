import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/formatacao-de-computador-curitiba")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/formatacao", statusCode: 301 });
  },
});
