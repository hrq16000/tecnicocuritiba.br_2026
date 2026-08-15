import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/redes-wifi/")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/redes-e-wifi", statusCode: 301 });
  },
});
