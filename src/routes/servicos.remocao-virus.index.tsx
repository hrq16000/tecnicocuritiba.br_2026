import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/remocao-virus/")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/remocao-de-virus", statusCode: 301 });
  },
});
