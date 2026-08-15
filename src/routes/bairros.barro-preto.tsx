import { createFileRoute } from "@tanstack/react-router";
import BarroPreto from "@/pages/bairros/BarroPreto";

export const Route = createFileRoute("/bairros/barro-preto")({
  component: BarroPreto,
});
