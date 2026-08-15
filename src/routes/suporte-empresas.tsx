import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/suporte-empresas")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/suporte-tecnico-empresarial", statusCode: 301 });
  },
});
