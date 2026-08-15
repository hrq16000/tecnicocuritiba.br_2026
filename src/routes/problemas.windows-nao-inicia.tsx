import { createFileRoute } from "@tanstack/react-router";
import ProblemaWindowsNaoInicia from "@/pages/problemas/WindowsNaoInicia";

export const Route = createFileRoute("/problemas/windows-nao-inicia")({
  component: ProblemaWindowsNaoInicia,
});
