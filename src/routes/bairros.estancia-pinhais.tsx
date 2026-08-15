import { createFileRoute } from "@tanstack/react-router";
import EstanciaPinhais from "@/pages/bairros/EstanciaPinhais";

export const Route = createFileRoute("/bairros/estancia-pinhais")({
  component: EstanciaPinhais,
});
