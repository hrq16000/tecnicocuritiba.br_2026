import { createFileRoute } from "@tanstack/react-router";
import ProblemaMouseNaoFunciona from "@/pages/problemas/MouseNaoFunciona";

export const Route = createFileRoute("/problemas/mouse-nao-funciona")({
  component: ProblemaMouseNaoFunciona,
});
