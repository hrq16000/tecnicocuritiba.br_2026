import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/remocao-de-virus-curitiba")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/remocao-de-virus", statusCode: 301 });
  },
});
