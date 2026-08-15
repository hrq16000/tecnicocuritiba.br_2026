import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/publicidade")({
  beforeLoad: () => {
    throw redirect({ to: "/anuncie", statusCode: 301 });
  },
});
