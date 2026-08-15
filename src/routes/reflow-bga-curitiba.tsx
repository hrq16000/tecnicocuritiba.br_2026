import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/reflow-bga-curitiba")({
  beforeLoad: () => {
    throw redirect({ href: "/procedimentos/reflow-bga-curitiba", statusCode: 301 });
  },
});
