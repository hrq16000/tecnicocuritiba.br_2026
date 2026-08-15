import { createFileRoute } from "@tanstack/react-router";
import ProblemaPage from "@/pages/ProblemaPage";

export const Route = createFileRoute("/problemas/$slug")({
  component: ProblemaPage,
});
