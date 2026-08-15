import { createFileRoute } from "@tanstack/react-router";
import PinevillePinhais from "@/pages/bairros/PinevillePinhais";

export const Route = createFileRoute("/bairros/pineville")({
  component: PinevillePinhais,
});
