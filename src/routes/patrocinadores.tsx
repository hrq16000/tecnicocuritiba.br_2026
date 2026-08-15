import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/patrocinadores")({
  beforeLoad: () => {
    throw redirect({ to: "/anuncie", statusCode: 301 });
  },
});
