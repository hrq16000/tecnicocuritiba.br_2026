import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tecnico-informatica-sao-jose-dos-pinhais")({
  beforeLoad: () => {
    throw redirect({ to: "/tecnico-informatica-sao-jose-pinhais", statusCode: 301 });
  },
});
