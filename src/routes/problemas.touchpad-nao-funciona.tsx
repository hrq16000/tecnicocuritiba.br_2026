import { createFileRoute } from "@tanstack/react-router";
import ProblemaTouchpadNaoFunciona from "@/pages/problemas/TouchpadNaoFunciona";

export const Route = createFileRoute("/problemas/touchpad-nao-funciona")({
  component: ProblemaTouchpadNaoFunciona,
});
