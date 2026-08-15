import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/conserto-pc-notebook/")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/manutencao-de-computador", statusCode: 301 });
  },
});
