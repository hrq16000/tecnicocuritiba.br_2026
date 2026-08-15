import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/montagem-de-pc-gamer")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/montagem-de-pc", statusCode: 301 });
  },
});
