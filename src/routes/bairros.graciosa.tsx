import { createFileRoute } from "@tanstack/react-router";
import GraciosaPinhais from "@/pages/bairros/GraciosaPinhais";

export const Route = createFileRoute("/bairros/graciosa")({
  component: GraciosaPinhais,
});
