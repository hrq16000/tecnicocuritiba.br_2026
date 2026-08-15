import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/assistencia-tecnica-empresas-curitiba")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/suporte-tecnico-empresarial", statusCode: 301 });
  },
});
