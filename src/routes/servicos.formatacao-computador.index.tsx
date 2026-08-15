import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/formatacao-computador/")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/formatacao", statusCode: 301 });
  },
});
