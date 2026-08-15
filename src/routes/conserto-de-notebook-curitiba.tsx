import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/conserto-de-notebook-curitiba")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/manutencao-de-notebook", statusCode: 301 });
  },
});
