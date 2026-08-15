import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pc-gamer-curitiba")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/montagem-de-pc", statusCode: 301 });
  },
});
