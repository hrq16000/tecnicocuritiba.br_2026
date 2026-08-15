import { createFileRoute } from "@tanstack/react-router";
import PoliticaCookiesAnuncios from "@/pages/PoliticaCookiesAnuncios";

export const Route = createFileRoute("/politica-de-cookies-e-anuncios")({
  component: PoliticaCookiesAnuncios,
});
