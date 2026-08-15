import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/pc-gamer")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/montagem-de-pc", statusCode: 301 });
  },
});
