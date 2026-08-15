import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/suporte-corporativo")({
  beforeLoad: () => {
    throw redirect({ to: "/empresa-de-ti-curitiba", statusCode: 301 });
  },
});
