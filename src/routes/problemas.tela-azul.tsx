import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/problemas/tela-azul")({
  beforeLoad: () => {
    throw redirect({ to: "/problemas/tela-azul-windows", statusCode: 301 });
  },
});
