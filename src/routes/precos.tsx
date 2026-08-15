import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/precos")({
  beforeLoad: () => {
    throw redirect({ to: "/precos-e-politicas", statusCode: 301 });
  },
});
