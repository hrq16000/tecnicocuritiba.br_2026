import { createFileRoute } from "@tanstack/react-router";
import ProblemaMonitorSemSinal from "@/pages/problemas/MonitorSemSinal";

export const Route = createFileRoute("/problemas/monitor-sem-sinal")({
  component: ProblemaMonitorSemSinal,
});
