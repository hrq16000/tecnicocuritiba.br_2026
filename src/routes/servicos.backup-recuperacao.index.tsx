import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/backup-recuperacao/")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/recuperacao-de-dados", statusCode: 301 });
  },
});
