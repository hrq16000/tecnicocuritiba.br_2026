import { createFileRoute } from "@tanstack/react-router";
import RemocaoVirusPortao from "@/pages/servico-bairro/RemocaoVirusPortao";

export const Route = createFileRoute("/servicos/remocao-virus/portao")({
  component: RemocaoVirusPortao,
});
