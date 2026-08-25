import { createFileRoute, redirect } from "@tanstack/react-router";

// Consolidada na Fase Final: sem intenção independente comprovada.
export const Route = createFileRoute("/servicos/redes-wifi/boa-vista")({
  beforeLoad: () => {
    throw redirect({ to: "/servicos/redes-e-wifi", statusCode: 301 });
  },
});
