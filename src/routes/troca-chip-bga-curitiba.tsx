import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/troca-chip-bga-curitiba")({
  beforeLoad: () => {
    throw redirect({ to: "/procedimentos/troca-chip-bga-curitiba", statusCode: 301 });
  },
});
