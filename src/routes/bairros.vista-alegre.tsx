import { createFileRoute } from "@tanstack/react-router";
import VistaAlegre from "@/pages/bairros/VistaAlegre";

export const Route = createFileRoute("/bairros/vista-alegre")({
  component: VistaAlegre,
});
