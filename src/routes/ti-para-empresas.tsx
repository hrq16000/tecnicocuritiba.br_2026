import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ti-para-empresas")({
  beforeLoad: () => {
    throw redirect({ to: "/empresa-de-ti-curitiba", statusCode: 301 });
  },
});
