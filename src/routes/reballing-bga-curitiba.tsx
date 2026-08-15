import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/reballing-bga-curitiba")({
  beforeLoad: () => {
    throw redirect({ to: "/procedimentos/reballing-bga-curitiba", statusCode: 301 });
  },
});
