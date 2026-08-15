import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/upgrade-ssd-memoria/")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/upgrade-ssd-ram", statusCode: 301 });
  },
});
