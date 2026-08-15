import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pessoa-juridica")({
  beforeLoad: () => {
    throw redirect({ to: "/empresa-de-ti-curitiba", statusCode: 301 });
  },
});
