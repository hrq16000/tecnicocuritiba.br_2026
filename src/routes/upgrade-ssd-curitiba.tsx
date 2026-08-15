import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/upgrade-ssd-curitiba")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/upgrade-ssd-ram", statusCode: 301 });
  },
});
