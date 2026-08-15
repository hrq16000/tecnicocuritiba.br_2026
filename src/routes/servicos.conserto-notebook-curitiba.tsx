import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/conserto-notebook-curitiba")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/manutencao-de-notebook", statusCode: 301 });
  },
});
