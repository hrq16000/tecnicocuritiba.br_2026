import { createFileRoute } from "@tanstack/react-router";
import ProblemaWifiCaindoTodaHora from "@/pages/problemas/WifiCaindoTodaHora";

export const Route = createFileRoute("/problemas/wifi-caindo-toda-hora")({
  component: ProblemaWifiCaindoTodaHora,
});
