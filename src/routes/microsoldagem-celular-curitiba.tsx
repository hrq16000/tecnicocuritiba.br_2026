import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/microsoldagem-celular-curitiba")({
  beforeLoad: () => {
    throw redirect({ href: "/procedimentos/microsoldagem-celular-curitiba", statusCode: 301 });
  },
});
