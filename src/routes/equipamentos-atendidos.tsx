import { createFileRoute } from "@tanstack/react-router";
import EquipamentosAtendidos from "@/pages/EquipamentosAtendidos";

export const Route = createFileRoute("/equipamentos-atendidos")({
  component: EquipamentosAtendidos,
});
