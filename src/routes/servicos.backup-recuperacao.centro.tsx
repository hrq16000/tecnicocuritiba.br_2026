import { createFileRoute } from "@tanstack/react-router";
import BackupCentro from "@/pages/servico-bairro/BackupCentro";

export const Route = createFileRoute("/servicos/backup-recuperacao/centro")({
  component: BackupCentro,
});
