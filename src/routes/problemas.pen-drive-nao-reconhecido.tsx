import { createFileRoute } from "@tanstack/react-router";
import ProblemaPenDriveNaoReconhecido from "@/pages/problemas/PenDriveNaoReconhecido";

export const Route = createFileRoute("/problemas/pen-drive-nao-reconhecido")({
  component: ProblemaPenDriveNaoReconhecido,
});
