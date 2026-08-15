import { createFileRoute } from "@tanstack/react-router";
import ProblemaWebcamNaoFunciona from "@/pages/problemas/WebcamNaoFunciona";

export const Route = createFileRoute("/problemas/webcam-nao-funciona")({
  component: ProblemaWebcamNaoFunciona,
});
