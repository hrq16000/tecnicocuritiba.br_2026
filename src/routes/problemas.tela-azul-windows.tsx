import { createFileRoute } from "@tanstack/react-router";
import ProblemaTelaAzulWindows from "@/pages/problemas/TelaAzulWindows";

export const Route = createFileRoute("/problemas/tela-azul-windows")({
  component: ProblemaTelaAzulWindows,
});
