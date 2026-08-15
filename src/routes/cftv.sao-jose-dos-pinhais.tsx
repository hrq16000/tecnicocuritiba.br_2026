import { createFileRoute } from "@tanstack/react-router";
import CFTVSaoJosePinhais from "@/pages/cftv/CFTVSaoJosePinhais";

export const Route = createFileRoute("/cftv/sao-jose-dos-pinhais")({
  component: CFTVSaoJosePinhais,
});
