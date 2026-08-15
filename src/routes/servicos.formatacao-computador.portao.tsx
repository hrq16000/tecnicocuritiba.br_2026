import { createFileRoute } from "@tanstack/react-router";
import FormatacaoPortao from "@/pages/servico-bairro/FormatacaoPortao";

export const Route = createFileRoute("/servicos/formatacao-computador/portao")({
  component: FormatacaoPortao,
});
