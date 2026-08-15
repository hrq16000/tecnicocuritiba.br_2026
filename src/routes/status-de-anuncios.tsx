import { createFileRoute } from "@tanstack/react-router";
import StatusAnuncios from "@/pages/StatusAnuncios";

export const Route = createFileRoute("/status-de-anuncios")({
  component: StatusAnuncios,
});
