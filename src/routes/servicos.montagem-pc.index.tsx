import { createFileRoute } from "@tanstack/react-router";
import MontagemPc from "@/pages/servicos/MontagemPc";

export const Route = createFileRoute("/servicos/montagem-pc/")({
  component: MontagemPc,
});
