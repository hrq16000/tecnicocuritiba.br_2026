import { createFileRoute } from "@tanstack/react-router";
import MarcaPage from "@/pages/MarcaPage";

export const Route = createFileRoute("/marcas/$slug")({
  component: MarcaPage,
});
