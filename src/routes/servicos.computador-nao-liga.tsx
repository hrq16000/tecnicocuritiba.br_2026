import { createFileRoute } from "@tanstack/react-router";
import ComputadorNaoLiga from "@/pages/servicos/ComputadorNaoLiga";

export const Route = createFileRoute("/servicos/computador-nao-liga")({
  component: ComputadorNaoLiga,
});
